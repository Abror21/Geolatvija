<?php

namespace App\Console\Commands;

use App\Repositories\AttachmentRepository;
use Illuminate\Console\Command;
use App\Traits\CommonHelper;

class CopyAttachmentsForTesting extends Command
{
    use CommonHelper;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'attachment:copy';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'CopyAttachmentsForTesting';

    public function __construct(
        private readonly AttachmentRepository $attachmentRepository,
    )
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //for testing purposes only
//        $copyId = 1183;
//        $type = '.zip';
//        $times = 100;
//
//        $attachment = $this->attachmentRepository->findById($copyId);
//
//        for ($t = 0; $t <= $times; $t++) {
//            $data = $attachment->toArray();
//            $data['display_name'] = static::generateUUIDv4() . $type;
//            $data['uuid'] = static::generateUUIDv4();
//
//            $this->attachmentRepository->store($data);
//        }

    }
}
