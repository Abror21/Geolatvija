<?php

namespace App\Repositories;

use App\Models\ThematicUserGroupRelation;
use Illuminate\Database\Eloquent\Model;


class ThematicUserGroupRelationRepository extends BaseRepository
{


    public function __construct(ThematicUserGroupRelation $thematicUserGroupRelation)
    {
        parent::__construct($thematicUserGroupRelation);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new ThematicUserGroupRelation();
    }

    public function getUserRelations($id)
    {
        return ThematicUserGroupRelation::select([
            'thematic_user_group_relations.id',
            'users.id as user_id', 'users.name',
            'users.surname',
            'users.personal_code',
            'thematic_user_group_relations.institution_classifier_id',
            'thematic_user_group_relations.is_active',
        ])
            ->join('users', 'users.id', 'thematic_user_group_relations.user_id')
            ->where('thematic_user_group_relations.thematic_user_group_id', $id)
            ->get();
    }


    public function getLegalRelations($id)
    {
        return ThematicUserGroupRelation::select([
            'thematic_user_group_relations.id',
            'thematic_user_group_relations.institution_classifier_id',
            'institution_classifiers.reg_nr',
            'institution_classifiers.name',
            'thematic_user_group_relations.is_active',
        ])
            ->join('institution_classifiers', 'institution_classifiers.id', 'thematic_user_group_relations.institution_classifier_id')
            ->where('thematic_user_group_relations.thematic_user_group_id', $id)
            ->whereNull('thematic_user_group_relations.user_id')
            ->get();
    }
}
