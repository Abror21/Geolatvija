<?php


namespace App\Repositories;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class UserRepository extends BaseRepository
{

    /**
     * UserRepository constructor.
     * @param User $user
     */
    public function __construct(User $user)
    {
        parent::__construct($user);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new User();
    }

    public function getUsers($options)
    {
        $filterSettings = [
            'status_classifier_value_id' => 'eq:users.status_classifier_value_id',
            'name' => 'like:users.full_name',
            'institutions' => 'in:institution_classifiers.id',
        ];

        $role = $this->activeRole();

        return User::select([
            'users.id',
            'users.name',
            'users.surname',
            'users.personal_code',
            'users.created_at',
            'users.last_login',
            DB::raw("STRING_AGG(institution_classifiers.name, ', ') AS institutions"),
            DB::raw("STRING_AGG(user_groups.name, ', ') AS roles")
        ])
            ->classifierValue('status_classifier_value_id', '', 'status_classifier_value')
            ->leftJoin('roles', 'roles.user_id', '=', 'users.id')
            ->leftJoin('institution_classifiers', 'institution_classifiers.id', '=', 'roles.institution_classifier_id')
            ->leftJoin('user_groups', 'user_groups.id', '=', 'roles.user_group_id')
            ->whereNull('roles.deleted_at')
            ->whereHas('userGroups', function (Builder $query) use ($options) {
                if (isset($options['filter']['user_groups'])) {
                    $query->whereIn('user_groups.id', $options['filter']['user_groups']);
                }

                return $query;
            })
            ->when(!$role->is_admin, function ($query) use ($role) {
                if ($role->is_data_owner) {
                    return $query->where(function ($query) use ($role) {
                        $query->where('roles.created_by_role_id', $role->id)
                            ->orWhere('roles.institution_classifier_id', $role->institution_classifier_id);
                    });
                }

                return $query->where('roles.institution_classifier_id', $role->institution_classifier_id);
            })
            ->when(!$role->is_admin, function ($query) {
                return $query->where('user_groups.code', '!=', 'admin');
            })
            ->search($filterSettings, $options['filter'])
            ->groupBy([
                'users.id',
                'users.name',
                'users.surname',
                'users.personal_code',
                'users.created_at',
                'users.last_login',
                'status_classifier_value.translation'
            ])
            ->paginate($options['page_size'] ?? 10);
    }

    public function checkUserAccess($id)
    {
        $role = $this->activeRole();

        return User::select([
            'users.id',
            'users.name',
            'users.surname',
            'users.personal_code',
            'users.created_at',
            'users.last_login',
        ])
            ->classifierValue('status_classifier_value_id', '', 'status_classifier_value')
            ->join('roles', 'roles.user_id', '=', 'users.id')
            ->leftJoin('institution_classifiers', 'institution_classifiers.id', '=', 'roles.institution_classifier_id')
            ->leftJoin('user_groups', 'user_groups.id', '=', 'roles.user_group_id')
            ->whereNull('roles.deleted_at')
            ->when(!$role->is_admin, function ($query) use ($role) {
                if ($role->is_data_owner) {
                    return $query->where(function ($query) use ($role) {
                        $query->where('roles.created_by_role_id', $role->id)
                            ->orWhere('roles.institution_classifier_id', $role->institution_classifier_id);
                    });
                }

                return $query->where('roles.institution_classifier_id', $role->institution_classifier_id);
            })
            ->when(!$role->is_admin, function ($query) {
                return $query->where('user_groups.code', '!=', 'admin');
            })
            ->where('users.id', $id)
            ->first();
    }

    public function deleteMultiple(array $ids)
    {
        $roles = Role::whereIn('user_id', $ids)->with('userGroup')->get();

        foreach ($roles as $role) {
            if ($role->userGroup->code == 'admin') {
                throw new \Exception('validation.cant_remove_admin');
            }
        }

        foreach ($roles as $role) {
            $role->delete();
        }

        User::whereIn('id', $ids)->delete();
    }

    public function users(array $ids)
    {
        return User::whereIn('id', $ids)->get();
    }

    public function userUniqueCheck($id, $personalCode)
    {
        return User::where('personal_code', $personalCode)
            ->whereNot('id', $id)
            ->first();
    }

    public function searchUser($search)
    {
        return User::select([
            'users.id',
            'users.name',
            'users.surname',
            'users.personal_code',
        ])
            ->where('users.personal_code', $search)
            ->first();
    }

    /**
     * @return Collection
     * @throws \Exception
     */
    public function selectUsers($options): Collection
    {
        $role = $this->activeRole();

        return User::select([
            DB::raw("CONCAT(users.name, ' ', users.surname) AS full_name"),
            'users.id'
        ])
            ->classifierValue('status_classifier_value_id', '', 'status_classifier_value')
            ->leftJoin('roles', 'roles.user_id', '=', 'users.id')
            ->leftJoin('user_groups', 'user_groups.id', '=', 'roles.user_group_id')
            ->whereNull('roles.deleted_at')
            ->when(!$role->is_admin, function ($query) use ($role) {
                if ($role->is_data_owner) {
                    return $query->where(function ($query) use ($role) {
                        $query->where('roles.created_by_role_id', $role->id)
                            ->orWhere('roles.institution_classifier_id', $role->institution_classifier_id);
                    });
                }

                return $query->where('roles.lower_created_by_role_id', $role->id);
            })
            ->when(isset($options['role']), function ($query) use ($options) {
                $query->addSelect(['roles.id', 'institution_classifiers.name as institution_name'])
                    ->leftJoin('institution_classifiers', 'institution_classifiers.id', '=', 'roles.institution_classifier_id')
                    ->where('user_groups.code', $options['role'])
                    ->groupBy('roles.id', 'institution_classifiers.name');
            })
            ->when(isset($options['roleId']) && !isset($options['role']) && $options['roleId'] == 'true', function ($query) use ($options) {
                $query->addSelect(['roles.id', 'institution_classifiers.name as institution_name'])
                    ->leftJoin('institution_classifiers', 'institution_classifiers.id', '=', 'roles.institution_classifier_id')
                    ->groupBy('roles.id', 'institution_classifiers.name');
            })
            ->orderBy('full_name', 'asc')
            ->groupBy([
                'users.id',
                'users.name',
                'users.surname',
                'status_classifier_value.translation'
            ])->get();
    }

    public function getUsersByIds($userIds) {
        return User::select([
            DB::raw("CONCAT(users.name, ' ', users.surname) AS full_name"),
            'users.id'
        ])
            ->when(!empty($userIds), function ($q) use ($userIds) {
                $q->whereIn('users.id', $userIds);
            })
            ->orderBy('users.name', 'asc')
            ->get();
    }

    public function findEmbedUser($personalCode, $regNr)
    {
        return User::select([
            'users.*',
            'roles.id as role_id'
        ])
            ->leftJoin('roles', 'roles.user_id', '=', 'users.id')
            ->leftJoin('institution_classifiers', 'institution_classifiers.id', '=', 'roles.institution_classifier_id')
            ->where('users.personal_code', $personalCode)
            ->when(isset($regNr), function ($q) use ($regNr) {
                $q->where('institution_classifiers.reg_nr', $regNr);
            })
            ->first();
    }
}
