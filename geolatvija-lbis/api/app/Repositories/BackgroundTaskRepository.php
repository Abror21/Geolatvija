<?php


namespace App\Repositories;

use App\Models\BackgroundTask;
use App\Models\ProcessingType;
use Illuminate\Database\Eloquent\Model;

class BackgroundTaskRepository extends BaseRepository
{

    /**
     * BackgroundTaskRepository constructor.
     * @param BackgroundTask $backgroundTask
     */
    public function __construct(BackgroundTask $backgroundTask)
    {
        parent::__construct($backgroundTask);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new BackgroundTask();
    }

    public function getBackgroundTaskList($options)
    {
        return BackgroundTask::select('background_tasks.*')
            ->paginate($options['pageSize'] ?? 10);
    }

    public function list($ids)
    {
        return BackgroundTask::whereIn('background_tasks.id', $ids)
            ->get();
    }

    public function active()
    {
        return BackgroundTask::where('is_active', true)
            ->get();
    }
}
