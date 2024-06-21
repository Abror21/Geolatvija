<?php

namespace App\Services;

use App\Enums\MinioBucketTypes;
use App\Enums\SystemSettingTypes;
use App\Enums\UnificationType;
use App\Repositories\AttachmentRepository;
use App\Repositories\GeoProducts\GeoProductFileRepository;
use App\Repositories\GeoProducts\GeoProductFilesFtpRepository;
use App\Repositories\ProcessingTypeRepository;
use App\Repositories\SystemSettingRepository;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use ZanySoft\Zip\Zip;

/**
 * Class GeoProductService
 * @package App\Services
 */
class FtpService extends BaseService
{
    private $ftp_conn;

    private $fileProcessingType;

    public function __construct(
        private readonly GeoProductFileRepository $geoProductFileRepository,
        private readonly StorageService $storageService,
        private readonly GeoProductFilesFtpRepository $geoProductFilesFtpRepository,
        private readonly SystemSettingRepository $systemSettingRepository,
        private readonly ProcessingTypeRepository $processingTypeRepository,
        private readonly AttachmentRepository $attachmentRepository
    )
    {
    }

    /**
     * @param $validated
     * @return array
     * @throws \Exception
     */
    public function loadFtpFiles($validated): array
    {
        $fileArray = [];
        if (!$this->ftp_conn) {
            $this->connect($validated);
        }

        if (env('APP_ENV') === 'local') {
//            $this->addFileToPublicFtp(); // for testing purpose uncomment when testing files is needed
//            $contents = ftp_rawlist($this->ftp_conn, '/' );
        }

        $this->fileProcessingType = $this->processingTypeRepository->findById($validated['processing_type_classifier_value_id']);
        $directories = explode(',', $this->fileProcessingType->directory_name);

        $fileFormat = $this->systemSettingRepository->findBy('key', SystemSettingTypes::FILE_FORMAT, true)->pluck('value')->toArray();


        foreach ($directories as $directory) {
            $contents = ftp_rawlist($this->ftp_conn, '/' . $directory);

            if (!empty($contents)) {
                foreach ($contents as $file) {
                    $parts = preg_split('/\s+/', $file);
                    Log::info(end($parts));

                    $success = $this->validateExtension(end($parts), $fileFormat);

                    if (!$success) {
                        continue;
                    }

                    $this->validateSize(isset($parts[4]) && is_int($parts[4]) ? $parts[4] : $parts[2]); //for windows support(2)

                    $fileArray[] = [
                        'name' => end($parts),
                        'dir' => $directory,
                        'date' => Carbon::now(),
                    ];
                }
            }
        }

        return $fileArray;
    }

    /**
     * @param $id
     * @return void
     * @throws \Exception
     */
    public function saveFiles($id): void
    {
        $files = $this->geoProductFileRepository->findById($id);

        if (!$files->processing_type_classifier_value_id) {
            return;
        }

        $serverFiles = $this->loadFtpFiles(
            [
                'ftp_address' => $files->ftp_address,
                'ftp_username' => $files->ftp_username,
                'ftp_password' => $files->ftp_password,
                'processing_type_classifier_value_id' => $files->processing_type_classifier_value_id
            ]
        );

        $info = $this->deleteCurrentFiles($files->id, $serverFiles);
        Log::info('ftp sync - finished deletion');

        $serverFiles = $info['server_files'];
        $zipNamesToBeRecreated = $info['zip_names_to_be_recreated'];

        $zipFiles = [];

        foreach ($serverFiles as $serverFile) {
            $geoFtpFile = null;
            $serverFile['new_file'] = false;
            if (!isset($serverFile['geo_ftp'])) {
                $geoFtpFile = $this->save($serverFile, $id);
                $serverFile['new_file'] = true;
            }

            if ($this->fileProcessingType->unification_type === UnificationType::UNIFY->value) {
                $zipName = substr($serverFile['name'], 0, $this->fileProcessingType->symbol_amount);

                if (!isset($serverFile['geo_ftp'])) {
                    $serverFile['geo_ftp'] = $geoFtpFile;
                }

                $zipFiles[$zipName][] = $serverFile;
            }
        }

        if ($this->fileProcessingType->unification_type === UnificationType::UNIFY->value) {
            foreach ($zipFiles as $key => $zipFile) {
                //check if there are new files in specific zip
                $count = collect($zipFile)->where('new_file', true)->count();

                //check if unified zip is already created
                $zipIdDoesntExist = collect($zipFile)->contains(function ($item) {
                    return is_null($item['geo_ftp']->zip_id);
                });

                Log::info('zipNamesToBeRecreated' . json_encode($zipNamesToBeRecreated));

                if ($count || in_array($key, $zipNamesToBeRecreated) || $zipIdDoesntExist) {
                    unset($zipNamesToBeRecreated[array_search($key, $zipNamesToBeRecreated)]);
                    $attachment = $this->attachmentRepository->findSpecificFile($key . '.zip', MinioBucketTypes::ftpFiles, $id);

                    $this->saveZip($zipFile, $key, $id);

                    if ($attachment) {
                        $this->storageService->deleteFile($attachment->id);
                    }
                }
            }
        }

        if (count($zipNamesToBeRecreated)) {
            foreach ($zipNamesToBeRecreated as $zipFileToBeDeleted) {
                $attachment = $this->attachmentRepository->findSpecificFile($zipFileToBeDeleted . '.zip', MinioBucketTypes::ftpFiles, $id);
                if ($attachment) {
                    $this->storageService->deleteFile($attachment->id);
                }
            }
        }

        if ($this->ftp_conn) {
            try {
                ftp_close($this->ftp_conn);
            } catch (\Exception $e) {
                Log::info('ftp close failed - ' . $e->getMessage());
            }
            $this->ftp_conn = null;
        }

        $files->update([
            'files_updated_at' => Carbon::now()
        ]);
    }

    /**
     * @param $serverFile
     * @param $id
     * @return Model
     * @throws \Illuminate\Validation\ValidationException
     */
    public function save($serverFile, $id)
    {
        $ext = '.' . pathinfo($serverFile['name'], PATHINFO_EXTENSION);
        $name = Str::random(10) . $ext;

        $file = storage_path('app/' . $name);

        ftp_get($this->ftp_conn, $file, $serverFile['dir'] . '/' . $serverFile['name'], FTP_BINARY);
        Log::info('file path -- ' . $file);
        $validator = Validator::make(['file' => $file], [
            'file' => ['clamav']
        ]);

        if ($validator->fails()) {
            Storage::disk('local')->delete($name);
            $validator->validate();
        }

        $attachment = $this->storageService->moveLocalFileFtp(MinioBucketTypes::ftpFiles, $serverFile['name'], $name, $ext, $id);

        $ftpFile = $this->geoProductFilesFtpRepository->store(
            [
                'attachment_id' => $attachment->id,
                'files_id' => $id,
                'zip_id' => null,
                'file_modified_date' => $serverFile['modified_date'] ?? null
            ]
        );

        Storage::disk('local')->delete($name);

        return $ftpFile;
    }

    /**
     * @param $files
     * @param $key
     * @param $id
     * @return void
     * @throws \Exception
     */
    private function saveZip($files, $key, $id): void
    {
        $fileName = $key . '.zip';
        $uniqueFileName = '/srv/www/public/' . $key . '_' . Str::random(6) . '.zip';

        $zip = new Zip();
        $zip->create($uniqueFileName);

        foreach ($files as $file) {
            $attachment = $this->attachmentRepository->findById($file['geo_ftp']->attachment_id);

            $file = $this->storageService->getFileAsString($file['geo_ftp']->attachment_id);

            $zip->addFromString($attachment->display_name, $file);
        }

        $zip->close();

        $zipFile = File::get($uniqueFileName);

        $zipAttachment = $this->storageService->storeFile($zipFile, MinioBucketTypes::ftpFiles, $fileName);

        $zipAttachment->geo_product_file_id = $id;
        $zipAttachment->save();

        File::delete($uniqueFileName);

        foreach ($files as $file) {
            $geoFtp = $file['geo_ftp'];
            $geoFtp->zip_id = $zipAttachment->id;
            $geoFtp->save();
        }
    }

    /**
     * @param $data
     * @return void
     * @throws \Exception
     */
    public function connect($data): void
    {
        try {
            $isFtps = false;
            if (str_contains($data['ftp_address'], 'ftp://')) {
                $data['ftp_address'] = str_replace('ftp://', '', $data['ftp_address']);
            }

            if (str_contains($data['ftp_address'], 'ftps://')) {
                $data['ftp_address'] = str_replace('ftps://', '', $data['ftp_address']);
                $isFtps = true;
            }

            if (str_contains($data['ftp_address'], '/')) {
                $data['ftp_address'] = str_replace('/', '', $data['ftp_address']);
            }

            $address = explode(':', $data['ftp_address'])[0];
            $port = explode(':', $data['ftp_address'])[1] ?? 21;

            if ($isFtps) {
                $this->ftp_conn = ftp_ssl_connect($address, $port);
                ftp_login($this->ftp_conn, $data['ftp_username'], $data['ftp_password']);
                ftp_pasv($this->ftp_conn, true);
            } else {
                $this->ftp_conn = ftp_connect($address, $port);
                ftp_login($this->ftp_conn, $data['ftp_username'], $data['ftp_password']);
                ftp_pasv($this->ftp_conn, true);
            }

        } catch (\Exception $e) {
            Log::error($e->getMessage());
            throw new \Exception('validation.ftp_connection_error');
        }
    }

    /**
     * only for development/testing
     * @return void
     */
    private function addFileToPublicFtp(): void
    {
        $dir1 = 'test-cs-dir2';
        $dir2 = 'test-cs-multi-dir';

        if (!ftp_mlsd($this->ftp_conn, '/' . $dir1)) {
            ftp_mkdir($this->ftp_conn, $dir1);
        }

        if (!ftp_mlsd($this->ftp_conn, '/' . $dir2)) {
            ftp_mkdir($this->ftp_conn, $dir2);
        }

        $mergeString = ['vfs', 'zip', 'sas', 'vcb', 'qwc', 'jyg', 'vdn'];

        for ($i = 0; $i <= 8; $i++) {
            $file = storage_path("app/test-$i.txt");
            $myfile = fopen($file, "w");
            $txt = $this->getName(24);
            fwrite($myfile, $txt);
            fclose($myfile);

            $key = array_rand($mergeString);
            ftp_put($this->ftp_conn, $dir1 . "/{$mergeString[$key]}-test-cs-$i.txt", $file, FTP_ASCII);

            $key = array_rand($mergeString);
            ftp_put($this->ftp_conn, $dir2 . "/{$mergeString[$key]}-test-mm-$i.txt", $file, FTP_ASCII);
        }
    }

    /**
     * only for development/testing
     *
     * @param $n
     * @return string
     */
    private function getName($n): string
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomString = '';

        for ($i = 0; $i < $n; $i++) {
            $index = rand(0, strlen($characters) - 1);
            $randomString .= $characters[$index];
        }

        return $randomString;
    }

    /**
     * @param $fileName
     * @return bool
     * @throws \Exception
     */
    private function validateExtension($fileName, $fileFormat): bool
    {
        $ext = pathinfo($fileName, PATHINFO_EXTENSION);

        if (!$ext) {
            return false;
        }

        $validExtensions = explode(' ', implode(' ', $fileFormat));

        if (!in_array($ext, $validExtensions)) {
            throw new \Exception('validations.invalid_extensions');
        }

        return true;
    }

    /**
     * @param $fileSize
     * @return bool
     * @throws \Exception
     */
    private function validateSize($fileSize): bool
    {
        $validSize = $this->systemSettingRepository->findBy('key', SystemSettingTypes::FILE_SIZE);

        $valid = !(intval($validSize->value) < (intval($fileSize) * 1024 * 1024));

        if (!$valid) {
            throw new \Exception('validations.invalid_file_size');
        }

        return true;
    }

    /**
     * @param $id
     * @return array
     */
    public function getFiles($id): array
    {
        $fileArray = $this->attachmentRepository->getFiles($id);

        $hasZip = $fileArray->whereNotNull('zip_id');

        $argument = 'ftp_' . $id;
        $lockFilePath = storage_path('app/' . $argument . '.lock');

        if ($hasZip) {
            return ['files' => array_values($fileArray->whereNull('zip_id')->toArray()), 'is_syncing' => File::exists($lockFilePath)];
        }

        return ['files' => $fileArray];
    }


    private function deleteCurrentFiles($id, $serverFiles)
    {
        $files = $this->geoProductFilesFtpRepository->findBy('files_id', $id, true, [], [], ['attachment']);

        $doNotDelete = [];
        $zipsToDelete = [];
        foreach ($serverFiles as &$serverFile) {
            $exists = $files->where('attachment.display_name', $serverFile['name'])->first();

            if ($exists) {
                $serverFile['modified_date'] = ftp_mdtm($this->ftp_conn, '/' . $serverFile['dir'] . '/' . $serverFile['name']);

                $fileDate = $serverFile['modified_date'];
                $savedFilesDate = $exists->file_modified_date;

                #if change unification type, then delete existing zips that were created
                if ($this->fileProcessingType->unification_type !== UnificationType::UNIFY->value && $exists->zip_id) {
                    $zipsToDelete[] = $exists->zip_id;
                    $exists->zip_id = null;
                    $exists->update();
                }

                if ($fileDate === $savedFilesDate) {
                    $doNotDelete[] = $exists->id;
                    $serverFile['geo_ftp'] = $exists;
                }
            }
        }

        foreach (array_unique($zipsToDelete) as $zip) {
            $this->storageService->deleteFile($zip);
        }

        $files = $files->whereNotIn('id', $doNotDelete)->all();

        $zipNamesToBeRecreated = [];
        foreach ($files as $file) {
            $this->storageService->deleteFile($file->attachment_id);

            $zipNamesToBeRecreated[] = substr($file->attachment['display_name'], 0, $this->fileProcessingType->symbol_amount);
        }

        return [
            'server_files' => $serverFiles,
            'zip_names_to_be_recreated' => array_unique($zipNamesToBeRecreated)
        ];
    }
}
