<?php


namespace App\Repositories;

use App\Models\UserGroup;
use App\Repositories\BaseRepository;
use Illuminate\Database\Eloquent\Model;

class UserGroupRepository extends BaseRepository
{

    /**
     * UserGroupRepository constructor.
     * @param User $userGroup
     */
    public function __construct(UserGroup $userGroup)
    {
        parent::__construct($userGroup);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new UserGroup();
    }

    public function getRoles($options)
    {
        $pageSize = $options['page_size'] ?? 10;

        $userGroups = UserGroup::withCount('roles')->paginate($pageSize);

        $userGroups->getCollection()->transform(function ($userGroup) {
            $userGroup['hasUsers'] = $userGroup->roles_count > 0;
            return $userGroup;
        });

        return $userGroups;
    }

    public function deleteMultiple(array $ids)
    {
        UserGroup::whereIn('id', $ids)->delete();
    }

    public function userGroupSelect($allowedCodes)
    {
        return UserGroup::select(['id', 'name', 'code'])
            ->when(!empty($allowedCodes), function ($q) use ($allowedCodes) {
                $q->whereIn('code', $allowedCodes);
            })
            ->orderBy('user_groups.name', 'asc')
            ->get();
    }

}
