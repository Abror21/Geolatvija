<?php

namespace App\Console\Commands;

use App\Repositories\UserEmbedRepository;
use Illuminate\Console\Command;

class MapImportedEmbed extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:embeds';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    public function __construct(
        private UserEmbedRepository $userEmbedRepository,
    )
    {
        parent::__construct();
    }
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $all = $this->userEmbedRepository->mapEmbeds();

        foreach ($all as $embed) {
            $embed->role_id = $embed['mapped_id'];
            $embed->update();
        }
    }
}
