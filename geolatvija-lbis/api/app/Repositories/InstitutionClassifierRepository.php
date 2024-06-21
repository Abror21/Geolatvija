<?php


namespace App\Repositories;

use App\Models\InstitutionClassifier;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Model;

class InstitutionClassifierRepository extends BaseRepository
{

    /**
     * InstitutionClassifierRepository constructor.
     * @param InstitutionClassifier $institutionClassifier
     */
    public function __construct(InstitutionClassifier $institutionClassifier)
    {
        parent::__construct($institutionClassifier);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new InstitutionClassifier();
    }

    public function getInstitutionClassifierList($options): mixed
    {
        return InstitutionClassifier::select(['institution_classifiers.id', 'institution_classifiers.name', 'institution_classifiers.reg_nr'])
            ->classifierValue('institution_type_classifier_value_id')
            ->when(true, function ($query) use ($options) {
                if (isset($options['sort_by'])) {
                    return $query->orderBy($this->parseOrderBy($options['sort_by']), $options['order_by'] ?? 'ASC');
                }

                return $query->orderBy($this->parseOrderBy('institution_classifiers.name'), $options['order_by'] ?? 'ASC');
            })
            ->paginate($options["page_size"] ?? 10);
    }

    public function select($institutionClassifierIds): mixed
    {
        return InstitutionClassifier::select(['institution_classifiers.id', 'institution_classifiers.name'])
            ->when(!empty($institutionClassifierIds), function ($q) use ($institutionClassifierIds) {
                $q->whereIn('institution_classifiers.id', $institutionClassifierIds);
            })
            ->orderBy('institution_classifiers.name', 'asc')
            ->get();
    }
}
