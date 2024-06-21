<?php


namespace App\Repositories;

use App\Models\ClassifierValue;
use App\Models\InstitutionClassifier;
use App\Models\Role;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
/**
 * Class BaseRepository
 * @package App\Repository
 */
abstract class BaseRepository
{
    /**
     * @var Model
     */
    public $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Collection|Model[]
     */
    public function all(array $columns = ['*'])
    {
        return $this->model->all($columns);
    }

    /**
     * Get all records, including soft deleted ones.
     *
     * @param array $columns
     * @return \Illuminate\Database\Eloquent\Collection|Model[]
     */
    public function withTrashed(array $columns = ['*'])
    {
        return $this->model->withTrashed()->get($columns);
    }

    /**
     * Get all soft deleted records.
     *
     * @param array $columns
     * @return \Illuminate\Database\Eloquent\Collection|Model[]
     */
    public function onlyTrashed(array $columns = ['*'])
    {
        return $this->model->onlyTrashed()->get($columns);
    }

    /**
     * @param $id
     * @param array $relationships
     * @param array $withCount
     * @return mixed
     */
    public function findTrashedById($id, $relationships = [], $withCount = [], $addSelect = []): Model
    {
        if (empty($relationships)) {
            return $this->model->withTrashed()->findOrFail($id);
        }

        return $this->model->withTrashed()->addSelect($addSelect)->with($relationships)->withCount($withCount)->findOrFail($id);
    }

    /**
     * @param $id
     * @param array $relationships
     * @param array $withCount
     * @return mixed
     */
    public function findById($id, $relationships = [], $withCount = [], $addSelect = []): Model
    {
        if (empty($relationships)) {
            return $this->model->findOrFail($id);
        }

        return $this->model->addSelect($addSelect)->with($relationships)->withCount($withCount)->findOrFail($id);
    }

    /**
     * @return Model
     */
    abstract public function create(): Model;

    /**
     * @param array $data
     * @return Model
     */
    public function store(array $data): Model
    {
        $model = $this->create();

        $model->fill($data);
        $model->save();

        return $model;
    }

    public function update($model, array $data): Model
    {
        if(!is_object($model)) {
            $model = $this->findById($model);
        }

        $model->fill($data);
        $model->save();

        return $model;
    }

    public function delete($model): bool
    {
        if(!is_object($model)) {
            $model = $this->findById($model);
        }

        return $model->delete();
    }

    /**
     *
     * Dynamic findBy function
     *
     * @param $column
     * @param $value
     * @param false $multiple
     * @param array $select
     * @param array $scopes
     * @param array $with
     * @param string | null $orderByColumn
     * @param 'asc' | 'desc' $orderByDirection
     * @return mixed
     */
    public function findBy($column, $value, $multiple = false, $select = [], $scopes = [], $with = [], $orderByColumn = null, $orderByDirection = 'asc')
    {
        $model = $this->model->where($column, $value)->addSelect($select)->with($with);

        if ($scopes) {
            foreach ($scopes as $scope) {
                if (is_array($scope)) {
                    $model->{array_key_first($scope)}($scope[array_key_first($scope)]);
                    continue;
                }

                $model->{$scope}();
            }
        }

        if ($multiple) {
            if ($orderByColumn && in_array(strtolower($orderByDirection), ['asc', 'desc'])) {
                $model->orderBy($orderByColumn, $orderByDirection);
            }

            return $model->get();
        }

        return $model->first();
    }

    /**
     * For searching in json column
     *
     * @param $value
     * @return string
     */
    public function parseOrderBy($value)
    {
        $exploded = explode('->', $value);

        foreach ($exploded as &$item) {
            if (ctype_upper($item)) {
                continue;
            }

            $item = Str::snake($item);
        }

        return implode("->", $exploded);
    }

    public function activeRole()
    {
        $role = $this->getRoleWithUserGroup();
        if (!$role) return null;

        if ($role->active_till && now()->greaterThan($role->active_till)) {
            throw new \Exception('validation.role_no_longer_active');
        }

        $role->group_code = $role->userGroup->code;
        $role->is_admin = $role->userGroup->code == 'admin';
        $role->is_data_owner = $role->userGroup->code == 'data_owner';
        $role->is_physical_person = $role->userGroup->code == 'authenticated';

        return $role;
    }

    public function activeInstitutionType()
    {
        $role = $this->getRoleWithUserGroup();
        if (!$role) return null;

        if ($role->active_till && now()->greaterThan($role->active_till)) {
            throw new \Exception('validation.role_no_longer_active');
        }

        $institution = InstitutionClassifier::where('id', $role->institution_classifier_id)->first();

        if (!$institution) return null;

        return ClassifierValue::where('id', $institution->institution_type_classifier_value_id)->first();
    }

    public function activeInstitution()
    {
        $role = $this->getRoleWithUserGroup();
        if (!$role) return null;

        if ($role->active_till && now()->greaterThan($role->active_till)) {
            throw new \Exception('validation.role_no_longer_active');
        }

        return InstitutionClassifier::where('id', $role->institution_classifier_id)->first();
    }

    public function roles()
    {
        $role = request()->user('sanctum');

        $roles = Role::where('user_id', $role->user_id)->get();

        return $roles;
    }

    private function getRoleWithUserGroup() {
        $role = request()->user('sanctum');

        if (!$role) {
            return null;
        }

        return Role::where('id', $role->id)
            ->where('user_id', $role->user_id)
            ->with('userGroup')
            ->first();
    }
}
