<?php

namespace App\Console\Commands;

use App\Repositories\RoleRepository;
use Illuminate\Console\Command;

class RoleActiveTill extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'role:is_active';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check if role should be disabled';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(
        private RoleRepository $roleRepository,
    )
    {
        parent::__construct();
    }


    public function handle()
    {
        $roles = $this->roleRepository->deactivateRoles();

        foreach ($roles as $role) {
            $role->is_active = false;
            $role->update();
        }
    }

}
