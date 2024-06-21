<?php

namespace App\Console\Commands;

use App\Models\Attachment;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class DbHealthCheckCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:db-health-check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check if Db instance is up';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $attachments = Attachment::whereNotNull('deleted_at')->withTrashed()->get();

        foreach ($attachments as $attachment) {
            dd($attachment->geoProductFilesFtp);
            if ($attachment->geoProductFilesFtp) {
                $attachment->geoProductFilesFtp->delete();
            }
        }

        dd('finished');

        try {
            DB::connection()->getPdo();
        } catch (\Exception $e) {
            $this->error('Unable to connect to database');
            return 1;
        }

        $this->info('Connected to database');

        return 0;
    }
}
