<?php

namespace App\Console\Commands;


use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CreateSchema extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'schema:create';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create schema';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(
    )
    {
        parent::__construct();
    }


    public function handle()
    {
        DB::statement('CREATE SCHEMA IF NOT EXISTS vzd');
    }

}
