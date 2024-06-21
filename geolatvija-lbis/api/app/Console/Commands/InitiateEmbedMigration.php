<?php

namespace App\Console\Commands;

use App\Imports\EmbedImport;
use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;

class InitiateEmbedMigration extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'embed:migration';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Initiate embed migration';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(
        private EmbedImport $embedImport
    )
    {
        parent::__construct();
    }


    public function handle()
    {
        Excel::import($this->embedImport, 'MapItemsPidReg2.csv');
    }

}
