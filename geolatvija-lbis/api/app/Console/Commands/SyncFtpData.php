<?php

namespace App\Console\Commands;

use App\Repositories\GeoProducts\GeoProductFileRepository;
use App\Services\FtpService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class SyncFtpData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ftp:sync {id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    public function __construct(
        private readonly FtpService $ftpService,
        private readonly GeoProductFileRepository $geoProductFileRepository,
    )
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $id = $this->argument('id');
        $argument = 'ftp_' . $this->argument('id');
        $lockFilePath = storage_path('app/' . $argument . '.lock');

        // Check if lock file exists
        if (File::exists($lockFilePath)) {
            $this->info("Command for '{$argument}' is already running.");
            return 0; // Exit gracefully
        }

        $file = $this->geoProductFileRepository->findById($id);

        try {
            $this->ftpService->connect([
                'ftp_address' => $file->ftp_address,
                'ftp_username' => $file->ftp_username,
                'ftp_password' => $file->ftp_password,
                'processing_type_classifier_value_id' => $file->processing_type_classifier_value_id
            ]);
        } catch (\Exception $e) {
            Log::info('ftp connection failed with - ' . $e->getMessage());
        }

        // Create lock file
        File::put($lockFilePath, '');

        try {
            $this->ftpService->saveFiles($id);
        } catch (\Exception $e) {
            Log::info('ftp sync failed with - ' . $e->getMessage());
        }

        File::delete($lockFilePath);
    }
}
