<?php

namespace App\Console\Commands;

use App\Repositories\AttachmentRepository;
use App\Services\FtpService;
use App\Services\StorageService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class FtpDeleteFiles extends Command
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
        private readonly AttachmentRepository $attachmentRepository,
        private readonly StorageService $storageService
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

        if ($id) {
            $attachments = $this->attachmentRepository->findBy('geo_product_file_id', $id, true);

            foreach ($attachments as $attachment) {
                $this->storageService->deleteFile($attachment->id);
            }
        }
    }
}
