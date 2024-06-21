<?php

namespace App\Console\Commands;

use App\Models\Attachment;
use Illuminate\Console\Command;

class FixAttachmentDisplayName extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'datafix:fix-attachment-display-name';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'datafix';

    public function __construct(

    ) {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $attachments = Attachment::where('display_name', 'LIKE', '%/srv/www/public/%')->get();

        foreach ($attachments as $attachment) {
            $attachment->display_name = str_replace('/srv/www/public/', '', $attachment->display_name);
            $attachment->update();
        }
    }
}
