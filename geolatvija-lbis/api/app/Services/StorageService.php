<?php

namespace App\Services;

use App\Events\ProductDownloadEvent;
use App\Repositories\AttachmentRepository;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StorageService extends BaseService
{

    public function __construct(
        private AttachmentRepository $attachmentRepository
    )
    {
    }

    public function show($rename, $filename, $bucket): StreamedResponse|JsonResponse
    {
        $storage = Storage::disk($bucket);

        if (!$storage->exists($filename)) {
            throw new Exception('validation.not_found', Response::HTTP_NOT_FOUND);
        }

        return $storage->download($filename, $rename);
    }

    public function storeFile($file, $bucket, $fileName = '', $type = null, $value = null, $uuid = null): Model
    {
        $minionName = $fileName ? $this->getName(40) . '.' . explode('.', $fileName)[1] : $fileName;
        $name = Storage::disk($bucket)->put($fileName ? $minionName: $fileName, $file);

        if (!$name) {
            throw new Exception('validation.failed_to_save_file', 500);
        }

        $attachment = [
            'filename' => $fileName ? $minionName : $name,
            'display_name' => $fileName ? $fileName  : $file->getClientOriginalName(),
            'bucket' => $bucket,
            'uuid' => $uuid,
        ];

        if ($type) {
            $attachment[$type] = $value;
        }

        return $this->attachmentRepository->store($attachment);
    }


    public function deleteFile($id): JsonResponse|bool
    {
        $attachment = $this->attachmentRepository->findById($id);

        $storage = Storage::disk($attachment->bucket);

        if (!$storage->exists($attachment->filename)) {
            throw new Exception('validation.not_found', Response::HTTP_NOT_FOUND);
        }

        $deleted = $storage->delete($attachment->filename);

        $attachment->delete();

        return $deleted;
    }

    public function getFile($id): StreamedResponse|JsonResponse
    {
        $attachment = $this->attachmentRepository->findById($id);

        $storage = Storage::disk($attachment->bucket);

        if (!$storage->exists($attachment->filename)) {
            throw new Exception('validation.not_found', Response::HTTP_NOT_FOUND);
        }

        if ($attachment->geo_product_file_id) {
            event(new ProductDownloadEvent([
                'id' => null,
                'geo_product_file_id' => $attachment->geo_product_file_id
            ], null));
        }

        return $storage->download($attachment->filename, $attachment->display_name);
    }

    public function getFileUuid($uuid, $asContent = false)
    {
        $attachment = $this->attachmentRepository->findBy('uuid', $uuid);

        if (!$attachment) {
            throw new Exception('validation.not_found', Response::HTTP_NOT_FOUND);
        }

        $storage = Storage::disk($attachment->bucket);

        if ($asContent) {
            return $storage->get($attachment->filename);
        }

        if (!$storage->exists($attachment->filename)) {
            throw new Exception('validation.not_found', Response::HTTP_NOT_FOUND);
        }

        return $storage->download($attachment->filename, $attachment->display_name);
    }

    public function getFileAsString($id)
    {
        $attachment = $this->attachmentRepository->findById($id);

        if (!$attachment) {
            throw new Exception('validation.not_found', Response::HTTP_NOT_FOUND);
        }

        $storage = Storage::disk($attachment->bucket);

        if (!$storage->exists($attachment->filename)) {
            throw new Exception('validation.not_found', Response::HTTP_NOT_FOUND);
        }

        return $storage->get($attachment->filename);
    }

    public function getFileAsStream($uuid)
    {
        $attachment = $this->attachmentRepository->findBy('uuid', $uuid);

        if (!$attachment) {
            throw new Exception('validation.not_found', Response::HTTP_NOT_FOUND);
        }

        $storage = Storage::disk($attachment->bucket);

        if (!$storage->exists($attachment->filename)) {
            throw new Exception('validation.not_found', Response::HTTP_NOT_FOUND);
        }

        return $storage->readStream($attachment->filename);
    }

    /**
     * @param $bucket
     * @param $displayName
     * @param string $extension
     * @return Model
     * @throws Exception
     */
    public function moveLocalFile($bucket, $displayName, string $extension = '', $filesId = null): Model
    {
        $fileName = Str::random(40) . $extension;

        $name = Storage::disk($bucket)->put($fileName  /* storage name */, Storage::disk('local')->get($displayName));

        if (!$name) {
            throw new Exception('validation.failed_to_save_file', 500);
        }

        $attachment = [
            'filename' => $fileName,
            'display_name' => $displayName,
            'bucket' => $bucket,
            'geo_product_file_id' => $filesId
        ];

        return $this->attachmentRepository->store($attachment);
    }

    public function moveLocalFileFtp($bucket, $displayName, $localFileName, string $extension = '', $filesId = null): Model
    {
        $fileName = Str::random(40) . $extension;

        $name = Storage::disk($bucket)->put($fileName  /* storage name */, Storage::disk('local')->get($localFileName));

        if (!$name) {
            throw new Exception('validation.failed_to_save_file', 500);
        }

        $attachment = [
            'filename' => $fileName,
            'display_name' => $displayName,
            'bucket' => $bucket,
            'geo_product_file_id' => $filesId
        ];

        return $this->attachmentRepository->store($attachment);
    }

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
}
