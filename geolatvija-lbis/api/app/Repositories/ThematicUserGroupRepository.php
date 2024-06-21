<?php

namespace App\Repositories;

use App\Models\ThematicUserGroup;
use Illuminate\Database\Eloquent\Model;


class ThematicUserGroupRepository extends BaseRepository
{


    public function __construct(ThematicUserGroup $thematicUserGroup)
    {
        parent::__construct($thematicUserGroup);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new ThematicUserGroup();
    }

    public function getThematicUserGroupList($options)
    {
        $role = $this->activeRole();

        return ThematicUserGroup::select(['thematic_user_groups.*'])
            ->when(!$role->is_admin, function ($query) use ($role) {
                return $query->where('thematic_user_groups.owner_institution_classifier_id', $role->institution_classifier_id);
            })

            ->paginate($options['page_size']);
    }

    public function select()
    {
        $role = $this->activeRole();

        return ThematicUserGroup::select(['thematic_user_groups.id', 'thematic_user_groups.name'])
            ->when(!$role->is_admin, function ($query) use ($role) {
                return $query->where('thematic_user_groups.owner_institution_classifier_id', $role->institution_classifier_id);
            })
            ->get();
    }
}
