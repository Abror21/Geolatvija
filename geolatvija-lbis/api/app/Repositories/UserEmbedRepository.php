<?php

namespace App\Repositories;

use App\Models\UserEmbeds;
use Illuminate\Database\Eloquent\Model;

/**
 * Class UserEmbedRepository
 * @package App\Repositories
 */
class UserEmbedRepository extends BaseRepository
{

    /**
     * UserEmbedRepository constructor.
     * @param UserEmbeds $userEmbed
     */
    public function __construct(UserEmbeds $userEmbed)
    {
        parent::__construct($userEmbed);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new UserEmbeds();
    }


    public function getUserEmbedsList($roleId, $institutionId, $options): mixed
    {

        return UserEmbeds::select('user_embeds.*')
            ->when(isset($options['filter']['name']), function ($query) use ($options) {
                return $query->where('user_embeds.name', 'LIKE', '%' . $options['filter']['name'] . '%');
            })
            ->leftJoin('roles', 'roles.id', 'user_embeds.role_id')
            ->leftJoin('roles as user_role', function ($join) use ($roleId) {
                $join->where('user_role.id', $roleId);
            })
            ->leftJoin('institution_classifiers', function ($join) {
                $join->on('user_embeds.reg_nr', '=', 'institution_classifiers.reg_nr');
            })

            ->where(function ($q) use ($roleId, $institutionId) {
                if ($institutionId) {
                    return $q->where(function ($q) {
                        return $q->whereNotNull('institution_classifiers.id')->whereNotNull('user_embeds.reg_nr')->whereRaw('user_role.institution_classifier_id = institution_classifiers.id');
                    });
                }

                return $q->where('role_id', '=', $roleId);
            })
            ->where('temp', '=', false)
            ->paginate($options['pageSize'] ?? 10);

    }

    public function getUserEmbedsCount($roleId, $institutionId): mixed
    {
        return UserEmbeds::leftJoin('roles', 'roles.id', 'user_embeds.role_id')
            ->leftJoin('roles as user_role', function ($join) use ($roleId) {
                $join->where('user_role.id', $roleId);
            })
            ->leftJoin('institution_classifiers', function ($join) {
                $join->on('user_embeds.reg_nr', '=', 'institution_classifiers.reg_nr');
            })
            ->where(function ($q) use ($roleId, $institutionId) {
                if ($institutionId) {
                    return $q->where(function ($q) {
                        return $q->whereNotNull('institution_classifiers.id')->whereNotNull('user_embeds.reg_nr')->whereRaw('user_role.institution_classifier_id = institution_classifiers.id');
                    });
                }

                return $q->where('role_id', '=', $roleId);
            })
            ->where('temp', '=', false)
            ->count();
    }

    public function mapEmbeds(): mixed
    {
        return UserEmbeds::select('user_embeds.*', 'roles.id as mapped_id')
            ->join('roles', 'roles.id', '=', 'user_embeds.role_id')
            ->join('users', 'users.id', '=', 'roles.user_id')
            ->whereNull('user_embeds.role_id')
            ->get();
    }

    public function findByUser($personalCode, $regNr = null): mixed
    {
        if ($regNr) {
            return UserEmbeds::select('user_embeds.*')
                ->where('user_embeds.reg_nr', $regNr)
                ->where('user_embeds.pid', $personalCode)
                ->get();
        }

        return UserEmbeds::select('user_embeds.*')
            ->whereNull('user_embeds.reg_nr')
            ->where('user_embeds.pid', $personalCode)
            ->get();
    }
}
