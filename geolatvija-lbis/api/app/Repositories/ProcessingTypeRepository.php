<?php


namespace App\Repositories;

use App\Models\ProcessingType;
use Illuminate\Database\Eloquent\Model;

class ProcessingTypeRepository extends BaseRepository
{

    public function __construct(ProcessingType $processingType)
    {
        parent::__construct($processingType);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new ProcessingType();
    }


    public function getProcessingTypeList($options)
    {
        $activeRole = $this->activeRole();

        return ProcessingType::select('processing_types.*')
            ->when(!$activeRole->is_admin, function ($query) use ($activeRole) {
                return $query->where('institution_classifier_id', $activeRole->institution_classifier_id);
            })
            ->paginate($options['pageSize'] ?? 10);
    }

    public function select()
    {
        $activeRole = $this->activeRole();
        return ProcessingType::select('id', 'name')
            ->when(!$activeRole->is_admin, function ($query) use ($activeRole) {
                return $query->where('institution_classifier_id', $activeRole->institution_classifier_id);
            })
            ->get();
    }

    public function deleteMultiple(array $ids): bool
    {
        $activeRole = $this->activeRole();

        $query = ProcessingType::whereIn('id', $ids);

        if (!$activeRole->is_admin) {
            $query->where('institution_classifier_id', $activeRole->institution_classifier_id);
        }

        $query->delete();

        return true;
    }
}
