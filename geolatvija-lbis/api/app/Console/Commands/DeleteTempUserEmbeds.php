<?php

namespace App\Console\Commands;

use App\Repositories\UserEmbedRepository;
use Illuminate\Console\Command;

class DeleteTempUserEmbeds extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'userembeds:delete-temp-user-embeds';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deletes temporarily (preview) made embeds';

    public function __construct(
        private readonly UserEmbedRepository $userEmbedRepository,
    ) {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $embeds = $this->userEmbedRepository->findBy('temp', true, true);

        foreach ($embeds as $embed) {
            $embed->delete();
        }
    }
}
