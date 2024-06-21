<?php

namespace App\Services;

use App\Repositories\BackgroundTaskRepository;
use App\Repositories\ProcessingTypeRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\Artisan;

class BackgroundTaskService extends BaseService
{


    public function __construct
    (
        private BackgroundTaskRepository $backgroundTaskRepository,
    )
    {
    }

    public function index($options)
    {
        return $this->backgroundTaskRepository->getBackgroundTaskList($options);
    }

    public function show($id)
    {
        return $this->backgroundTaskRepository->findById($id);
    }

    public function update($id, $data)
    {
        return $this->backgroundTaskRepository->update($id, $data);
    }

    public function disable($id, $active)
    {
        return $this->backgroundTaskRepository->update($id, ['is_active' => $active]);
    }

    public function run($ids): void
    {
        $tasks = $this->backgroundTaskRepository->list( $ids);

        foreach ($tasks as $task) {
            Artisan::queue($task->command);
        }
    }

    public function finishTask($command): bool
    {
        $task = $this->backgroundTaskRepository->findBy('command', $command);

        if ($task) {
            $executedAt = $task->executed_at;
            $now = Carbon::now();
            $task->execution_time = $executedAt->diffInSeconds($now);
            $task->failed = false;
            $task->update();
        }

        return true;
    }

}
