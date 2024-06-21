<?php


namespace App\Actions\Saml;


use App\Models\User;
use App\Repositories\ClassifierValueRepository;
use App\Repositories\RoleRepository;
use App\Repositories\UserEmbedRepository;
use App\Repositories\UserGroupRepository;
use App\Services\API\APIOuterAPI;
use App\Services\UserNotificationService;
use Carbon\Carbon;

/**
 * Class SyncUserFromSaml
 * @package App\Actions\Saml
 */
class SyncUserFromSaml
{

    public function __construct(
        private readonly ClassifierValueRepository $classifierValueRepository,
        private readonly UserGroupRepository $userGroupRepository,
        private readonly RoleRepository $roleRepository,
        private readonly UserNotificationService $userNotificationService,
        private readonly APIOuterAPI $APIOuterAPI,
        private readonly UserEmbedRepository $userEmbedRepository,
    )
    {
        $this->headers = ['X-GEO-HTTP-SECRET' => config('geo.api_outer_service_token')];
    }

    /**
     * @param $saml2User
     * @return mixed
     */
    public function sync($saml2User): mixed
    {
        $user = $this->isExistingUser($saml2User['personal_code']);

        if (!$user) {
            $saml2User['active_till'] = Carbon::now()->addYear();

            $user = $this->create($saml2User);

            $userGroup = $this->userGroupRepository->findBy('code', 'authenticated');

            $role = $this->roleRepository->store([
                'user_id' => $user->id,
                'user_group_id' => $userGroup->id,
                'is_active' => true,
                'active_till' => Carbon::now()->addYear()
            ]);

            //for migration embeds, after some time can be removed
            $userEmbeds = $this->userEmbedRepository->findByUser($saml2User['personal_code']);
            foreach ($userEmbeds as $userEmbed) {
                $userEmbed->role_id = $role->id;
                $userEmbed->update();
            }

            $personalCode = $user->personal_code;

            $userNotifications = $this->APIOuterAPI->call('api/v1/tapis/get-user-notifications/' . $personalCode, [], 'GET', $this->headers);
            if (isset($userNotifications['Success']) && $userNotifications['Success']) {
                $this->userNotificationService->syncUserNotificationsFromTapis($userNotifications, $personalCode);
            }
        } else {
            $user->last_login = Carbon::now();
            $user->update();

            //if for some reason the role is missing
            $role = $this->roleRepository->getAuthenticatedUserRole($user->id);
            if (!$role) {
                $userGroup = $this->userGroupRepository->findBy('code', 'authenticated');

                $this->roleRepository->store([
                    'user_id' => $user->id,
                    'user_group_id' => $userGroup->id,
                    'is_active' => true,
                    'active_till' => Carbon::now()->addYear()
                ]);
            }
        }

        if ($user->personal_code) {
            $this->userNotificationService->syncDiscussionAnswers($user);
        }

        return $user;
    }


    /**
     * Check if user already exists
     *
     *
     * @param string $personalCode
     * @return mixed
     */
    public function isExistingUser(string $personalCode): mixed
    {
        return User::where(
            "personal_code",
            $personalCode
        )->first();
    }

    /**
     * @param $saml2User
     * @return mixed
     */
    public function create($saml2User): mixed
    {

        $activeClassifier = $this->classifierValueRepository->getClassifierValueByCodes('KL21', 'ACTIVE');

        $user = [
            'name' => $saml2User['first_name'],
            'surname' => $saml2User['last_name'],
            'full_name' => $saml2User['first_name'] . " " . $saml2User['last_name'],
            'personal_code' => $saml2User['personal_code'],
            'status_classifier_value_id' => $activeClassifier->id,
            'last_login' => Carbon::now()
        ];

        return User::create($user);
    }

}
