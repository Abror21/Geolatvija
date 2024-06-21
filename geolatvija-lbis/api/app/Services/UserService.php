<?php

namespace App\Services;

use App\Repositories\ClassifierValueRepository;
use App\Repositories\GeoProductOrderRepository;
use App\Repositories\InstitutionClassifierRepository;
use App\Repositories\RoleRepository;
use App\Repositories\UserEmbedRepository;
use App\Repositories\UserGroupRepository;
use App\Repositories\UserRepository;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

/**
 * Class UserService
 * @package App\Services
 */
class UserService extends BaseService
{
    public function __construct(
        private UserRepository $userRepository,
        private RoleRepository $roleRepository,
        private UserGroupRepository $userGroupRepository,
        private ClassifierValueRepository $classifierValueRepository,
        private GeoProductOrderRepository $geoProductOrderRepository,
        private InstitutionClassifierRepository $institutionClassifierRepository,
        private UserEmbedRepository $userEmbedRepository,
    ) {
    }

    public function me($userId)
    {
        $user = $this->userRepository->findById($userId);
        $roles = $this->roleRepository->userRoles($user->id);
        $activeRole = $this->roleRepository->activeRole();

        $user->userNotifications = $user::withCount('userNotifications')->where('id', $user->id)->get()->value('user_notifications_count');
        $user->publicDiscussionCommentAnswers = $user::withCount('publicDiscussionCommentAnswers')->where('id', $user->id)->get()->value('public_discussion_comment_answers_count');

        if ($activeRole) {
            $user->userEmbeds = $this->userEmbedRepository->getUserEmbedsCount($activeRole->id, $activeRole->institution_classifier_id);
        }

        $user->roles = $roles
            ->filter(fn($item) => $item->active_till > Carbon::now() || $item->active_till === null)
            ->values()
            ->toArray();

        $user->maskPersonalCode();

        return $user;
    }

    public function getUsers($options)
    {
        $users = $this->userRepository->getUsers($options);

        foreach ($users as $user) {
            $user->personal_code = $user->maskPersonalCode();
        }

        return $users;
    }

    public function show($id)
    {
        $user = $this->userRepository->findById($id);
        $user->maskPersonalCode();

        $roles = $this->roleRepository->availableUserRoles($id)->toArray();

        foreach ($roles as $key => &$role) {
            $role['index'] = $key;
        }

        $user->roles = $this->snakeToCamelArrayKeys($roles);

        return $user;
    }

    public function store($params): Model
    {
        DB::beginTransaction();
        $user = $this->userRepository->findBy('personal_code', $params['personal_code']);

        if (!$user) {
            if (!isset($params['status_classifier_value_id'])) {
                $classifierValue = $this->classifierValueRepository->getClassifierValueByCodes('KL21', 'INACTIVE');

                $params['status_classifier_value_id'] = $classifierValue->id;
            }

            if (!isset($params['active_till'])) {
                $params['active_till'] = Carbon::now()->addYear();
            }

            $user = $this->userRepository->store($params);

            $user->maskPersonalCode();

            $authenticatedRole = $this->userGroupRepository->findBy('code', 'authenticated');

            $params['roles'][] = [
                'user_group_id' => $authenticatedRole->id,
                'active_till' => $params['active_till'],
                'is_active' => true,
                'institution_classifier_id' => null,
            ];
        } else {
            $access = $this->userRepository->checkUserAccess($user->id);

            if ($access) {
                throw new \Exception('validation.user_already_exist');
            }
        }

        $this->storeUpdateUserRoles($user->id, $params, $user);

        DB::commit();
        return $user;
    }

    public function updateAccount($activeRole, $params): Model
    {
        $roles = $this->roleRepository->findBy('user_id', $activeRole->user_id)->get();
        $user = $this->userRepository->findById($activeRole->user_id);
        if ($roles) {
            $role = $roles->where('id', $params['selected_role'])->first();

            if (!$role) {
                throw new \Exception('Role not found!');
            }

            if (isset($params['email'])) {
                $isAlreadyVerifiedEmail = false;

                foreach ($roles as $_role) {
                    if ($_role->email === $params['email'] && $_role->email_verified) {
                        $isAlreadyVerifiedEmail = true;
                    }
                }

                $role->email = $params['email'];
                $role->email_verified = $isAlreadyVerifiedEmail;
            } else {
                $role->email = null;
                $role->email_verified = false;
            }
            $role->update();
        }

        return $this->userRepository->update($user, $params);
    }

    public function update($id, $data): Model
    {
        $exists = $this->userRepository->userUniqueCheck($id, $data['personal_code']);

        if ($exists) {
            throw new \Exception('validation.personal_code_not_unique');
        }

        unset($data['personal_code']);

        $user = $this->userRepository->update($id, $data);

        $this->storeUpdateUserRoles($id, $data, $user);
        $user->maskPersonalCode();

        return $user;
    }

    public function deleteMultiple($ids)
    {
        return $this->userRepository->deleteMultiple($ids);
    }

    public function extend($ids)
    {
        $users = $this->userRepository->users($ids);

        foreach ($users as $user) {
            $user->active_till = Carbon::parse($user->active_till)->addYear();
            $user->update();
        }

    }

    public function storeUpdateUserRoles($userId, $data, $user)
    {
        $roles = $this->roleRepository->findBy('user_id', $userId, true);
        $activeRole = $this->roleRepository->activeRole();

        if (!$activeRole->is_admin) {
            $roles = $roles->where('institution_classifier_id', $activeRole->institution_classifier_id)->whereNotIn('id', [$activeRole->id])->values();
        }

        if (!$activeRole->is_admin) {
            $allRoles = $this->roleRepository->roles();
            $institutionClassifierIds = $allRoles->pluck('institution_classifier_id')->toArray();
        }

        foreach ($data['roles'] as $index => $role) {
            //update
            if (isset($role['id'])) {
                $existingRole = $roles->where('id', $role['id'])->first();

                if ($existingRole) {
                    $existingRole->active_till = $role['active_till'] ?? null;
                    $existingRole->email = $data['emails'][$index] ?? null;
                    $existingRole->is_active = $role['is_active'] ?? $existingRole->is_active;
                    $existingRole->update();
                }
            } else {
                //create
                if (!$activeRole->is_admin && !$activeRole->is_data_owner) {
                    if (!empty($institutionClassifierIds)) {
                        if (!in_array($role['institution_classifier_id'], $institutionClassifierIds)) {
                            throw new \Exception('validation.institution_not_available', 403);
                        }
                    }
                }

                if (!$activeRole->is_admin) {
                    $userGroup = $this->userGroupRepository->findById($role['user_group_id']);

                    //GEO-506
                    switch ($activeRole->group_code) {
                        case 'data_owner':
                            if (!in_array($userGroup->code, ['institution_admin', 'authenticated'])) {
                                throw new \Exception('validation.role_not_available', 403);
                            }
                            break;
                        case 'institution_admin':
                            if (!in_array($userGroup->code, ['authenticated'])) {
                                throw new \Exception('validation.role_not_available', 403);
                            }
                            break;
                        default:
                            if (!in_array($userGroup->code, ['authenticated'])) {
                                throw new \Exception('validation.role_not_available', 403);
                            }
                    }
                }


                $roleData = [
                    'user_group_id' => $role['user_group_id'],
                    'user_id' => $userId,
                    'active_till' => $role['active_till'] ?? null,
                    'email' => $data['emails'][$index] ?? null,
                    'is_active' => $role['is_active'] ?? false,
                    'institution_classifier_id' => $role['institution_classifier_id'],
                    'created_by_role_id' => $activeRole->is_data_owner ? $activeRole->id : $activeRole->created_by_role_id,
                    'lower_created_by_role_id' => $activeRole->id,
                ];

                $existingRole = $this->roleRepository->store($roleData);
            }

            if ($existingRole->institution_classifier_id) {
                $institutionClassifier = $this->institutionClassifierRepository->findById($existingRole->institution_classifier_id);
                $userEmbeds = $this->userEmbedRepository->findByUser($user->personal_code, $institutionClassifier->reg_nr);
            } else {
                $userEmbeds = $this->userEmbedRepository->findByUser($user->personal_code);
            }

            foreach ($userEmbeds as $userEmbed) {
                $userEmbed->role_id = $existingRole->id;
                $userEmbed->update();
            }
        }

        $ids = Arr::pluck($data['roles'], 'id');
        $delete = $roles->whereNotIn('id', $ids);

        //delete
        foreach ($delete as $d) {
            $d->delete();
            $this->updateOrderStatus($d);

        }

    }

    public function getUserByPersonalCode($personalCode)
    {
        return $this->userRepository->findBy('personal_code', $personalCode);
    }

    /**
     * @param $options
     * @return array
     * @throws \Exception
     */
    public function select($options): array
    {
        $users = [];

        if ($options['type'] === 'DEFAULT') {
            $users = $this->userRepository->selectUsers($options);
        }

        if ($options['type'] === 'LIMITED_BY_DT_ORDERS') {
            $userIds = $this->geoProductOrderRepository->getAllOrdersForSelectsByInstitution()->pluck('user_id');
            $users = $this->userRepository->getUsersByIds($userIds)->toArray();
        }

        return $users;
    }


    private function updateOrderStatus($role)
    {
        //        $otherInstitutionRoles = $this->roleRepository->getInstitutionUserRoles($role);

        $orders = $this->geoProductOrderRepository->findBy('role_id', $role->id, true);
        $classifierValue = $this->classifierValueRepository->getClassifierValueByCodes('KL19', 'INACTIVE');
        $this->updateStatus($orders, $classifierValue);
    }

    /**
     * @param $orders
     * @param $classifierValue
     * @return void
     */
    private function updateStatus($orders, $classifierValue)
    {
        foreach ($orders as $order) {
            $order->order_status_classifier_value_id = $classifierValue->id;
            $order->save();
        }
    }
}
