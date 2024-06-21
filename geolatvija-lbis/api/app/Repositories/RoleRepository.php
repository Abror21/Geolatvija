<?php


namespace App\Repositories;

use App\Models\Role;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class RoleRepository extends BaseRepository
{

    /**
     * RoleRepository constructor.
     * @param Role $role
     */
    public function __construct(Role $role)
    {
        parent::__construct($role);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new Role();
    }


    public function userRoles($id)
    {
        return Role::select('roles.*', 'user_groups.name', 'user_groups.code', 'institution_classifiers.name as institution_name', 'institution_classifiers.reg_nr')
            ->where('roles.user_id', $id)
            ->where('roles.is_active', true)
            ->leftJoin('user_groups', 'user_groups.id', '=', 'roles.user_group_id')
            ->leftJoin('institution_classifiers', 'institution_classifiers.id', '=', 'roles.institution_classifier_id')
            ->get();
    }

    public function availableUserRoles($id)
    {
        $role = $this->activeRole();

        return Role::select('roles.*')
            ->where('roles.user_id', $id)
            ->join('user_groups', 'user_groups.id', '=', 'roles.user_group_id')
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
            ->get();
    }

    public function deactivateRoles()
    {
        return Role::where('is_active', true)
            ->where('active_till', '<', Carbon::now())
            ->whereNotNull('active_till')
            ->get();
    }

    public function getInstitutionUserRoles($role)
    {
        return $this->create()
            ->where('institution_classifier_id', $role->institution_classifier_id)
            ->where('user_id', $role->user_id)
            ->where('id', '!=', $role->id)
            ->get();
    }

    public function getAuthenticatedUserRole($userId)
    {
        return Role::select('roles.id')
            ->where('roles.user_id', $userId)
            ->where('roles.is_active', true)
            ->leftJoin('user_groups', 'user_groups.id', '=', 'roles.user_group_id')
            ->where('user_groups.code', 'authenticated')
            ->first();
    }

}
