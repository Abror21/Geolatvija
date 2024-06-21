<?php

namespace App\Services;


use App\Enums\GeoProductLicenceTypes;
use App\Enums\GeoProductPaymentType;
use App\Enums\LicenceTypes;
use App\Models\ThematicUserGroup;
use App\Repositories\ClassifierValueRepository;
use App\Repositories\GeoProductOrderRepository;
use App\Repositories\GeoProducts\GeoProductFileRepository;
use App\Repositories\GeoProducts\GeoProductServiceRepository;
use App\Repositories\InstitutionClassifierRepository;
use App\Repositories\ThematicUserGroupRelationRepository;
use App\Repositories\ThematicUserGroupRepository;
use App\Repositories\UserRepository;
use Illuminate\Database\Eloquent\Model;

class ThematicUserGroupService extends BaseService
{


    public function __construct
    (
        private ThematicUserGroupRepository         $thematicUserGroupRepository,
        private ThematicUserGroupRelationRepository $thematicUserGroupRelationRepository,
        private UserRepository                      $userRepository,
        private InstitutionClassifierRepository     $institutionClassifierRepository,
        private GeoProductServiceRepository         $geoProductServiceRepository,
        private GeoProductFileRepository            $geoProductFileRepository,
        private GeoProductOrderRepository           $geoProductOrderRepository,
        private ClassifierValueRepository           $classifierValueRepository
    )
    {
    }

    public function index($options)
    {
        return $this->thematicUserGroupRepository->getThematicUserGroupList($options);
    }

    public function show($id)
    {
        $thematicUserGroup = $this->thematicUserGroupRepository->findById($id);

        $userRelations = $this->thematicUserGroupRelationRepository->getUserRelations($id);
        $legalRelations = $this->thematicUserGroupRelationRepository->getLegalRelations($id);

        $combined = array_merge($userRelations->toArray(), $legalRelations->toArray());

        foreach ($combined as $key => &$value) {
            $value['index'] = $key;
        }

        $thematicUserGroup->users = $combined;

        return $thematicUserGroup;
    }

    public function update($id, $data)
    {
        $this->validateUserUniqueness($data['users']);

        $thematicUserGroup = $this->thematicUserGroupRepository->update($id, $data);

        $thematicGroupRelations = $this->thematicUserGroupRelationRepository->findBy('thematic_user_group_id', $id, true);

        $actualIndex = 0;
        //update existing or delete unnecessary
        foreach ($thematicGroupRelations as $index => $thematicGroupRelation) {
            if (isset($data['users'][$index])) {
                if (isset($data['users'][$index]['user_id'])) {
                    $orders = $this->geoProductOrderRepository->getOrdersForThematicGroupCheck($data['users'][$index]['user_id']);
                    $activeStatus = $this->classifierValueRepository->getClassifierValueByCodes('KL19',  'ACTIVE');

                    foreach ($orders as $order) {
                        if ($order->order_status_classifier_value_id !== $activeStatus->id) {
                            continue;
                        }

                        $div = null;
                        if (isset($order->geo_product_service_id)) {
                            $div = $this->geoProductServiceRepository->findTrashedById($order->geo_product_service_id);
                        } else if (isset($order->geo_product_file_id)) {
                            $div = $this->geoProductFileRepository->findTrashedById($order->geo_product_file_id);
                        }

                        if (!$div) {
                            continue;
                        }

                        $isBelongToGroup = $div->available_restriction_type->value === 'BELONG_TO_GROUP';
                        $isSameThematicGroup = $div->thematic_user_group_id === $thematicUserGroup->id;
                        $isSameInstitution = isset($data['users'][$index]['institution_classifier_id']) && $thematicGroupRelation->institution_classifier_id === $data['users'][$index]['institution_classifier_id'];
                        $isActiveUser = $data['users'][$index]['is_active'];

                        if (
                            $isBelongToGroup &&
                            $isSameThematicGroup &&
                            $thematicGroupRelation->user_id === $data['users'][$index]['user_id'] &&
                            !$isActiveUser
                        ) {
                            throw new \Exception('validation.thematic_group_disable_user');
                        }

                        if ($isBelongToGroup && $isSameThematicGroup && !$isSameInstitution) {
                            throw new \Exception('validation.thematic_group_change_institution');
                        }
                    }

                    $institutionClassifierId = null;
                    if (isset($data['users'][$index]['institution_classifier_id'])) {
                        $institutionClassifierId = $data['users'][$index]['institution_classifier_id'];
                    } else if (isset($data['users'][$index]['reg_nr'])) {
                        $institutionClassifierId = $data['users'][$index]['id'];
                    }

                    $thematicGroupRelation->user_id = $data['users'][$index]['user_id'] ?? null;
                    $thematicGroupRelation->institution_classifier_id = $institutionClassifierId;
                    $thematicGroupRelation->is_active = $data['users'][$index]['is_active'] ?? false;
                    $thematicGroupRelation->update();
                }
            } else {
                // check if in any DIV if yes change status
                $thematicGroupRelation->delete();
                $this->updateOrderStatus($id);
            }
            $actualIndex += 1;
        }

        //create while new entries
        while (isset($data['users'][$actualIndex])) {
            $institutionClassifierId = null;
            if (isset($data['users'][$actualIndex]['institution_classifier_id'])) {
                $institutionClassifierId = $data['users'][$actualIndex]['institution_classifier_id'];
            } else if (isset($data['users'][$actualIndex]['reg_nr'])) {
                $institutionClassifierId = $data['users'][$actualIndex]['id'];
            }

            $parse = [
                'user_id' => isset($data['users'][$actualIndex]['personal_code']) ? $data['users'][$actualIndex]['id'] : null,
                'thematic_user_group_id' => $thematicUserGroup->id,
                'institution_classifier_id' => $institutionClassifierId,
                'is_active' => $data['users'][$actualIndex]['is_active'] ?? false
            ];

            $this->thematicUserGroupRelationRepository->store($parse);

            $actualIndex += 1;
        }


        return $thematicUserGroup;
    }

    public function store($data)
    {
        $this->validateUserUniqueness($data['users']);

        $activeRole = $this->thematicUserGroupRepository->activeRole();
        $data['owner_institution_classifier_id'] = $activeRole->institution_classifier_id;

        $thematicUserGroup = $this->thematicUserGroupRepository->store($data);

        foreach ($data['users'] as $user) {
            $institutionClassifierId = null;
            if (isset($user['institution_classifier_id'])) {
                $institutionClassifierId = $user['institution_classifier_id'];
            } else if (isset($user['reg_nr'])) {
                $institutionClassifierId = $user['id'];
            }

            $parse = [
                'user_id' => isset($user['personal_code']) ? $user['id'] : null,
                'thematic_user_group_id' => $thematicUserGroup->id,
                'institution_classifier_id' => $institutionClassifierId,
                'is_active' => $user['is_active'] ?? false
            ];

            $this->thematicUserGroupRelationRepository->store($parse);
        }

        return $thematicUserGroup;
    }

    public function delete($ids): bool
    {
        foreach ($ids as $id) {
            $thematicGroup = $this->thematicUserGroupRepository->findById($id, ['geoProductServices', 'geoProductFiles']);

            if (!$thematicGroup->geoProductServices->isEmpty() || !$thematicGroup->geoProductFiles->isEmpty()) {
                throw new \Exception('validation.thematic_group_is_used');
            }

            $thematicGroupRelations = $this->thematicUserGroupRelationRepository->findBy('thematic_user_group_id', $id, true);
            foreach ($thematicGroupRelations as $thematicGroupRelation) {
                $thematicGroupRelation->delete();
            }

            $thematicGroup->delete();
        }

        return true;
    }

    private function validateUserUniqueness($users) {
        $isUnique = function ($key) use ($users) {
            return count(array_column($users, $key)) === count(array_unique(array_column($users, $key)));
        };

        if(!($isUnique('reg_nr') && $isUnique('personal_code'))) {
            throw new \Exception('thematic_user_group.person_already_exists');
        }
    }

    public function searchUser($type, $search): Model
    {
        if ($type == 'PHYSICAL_PERSON') {
            $user = $this->userRepository->searchUser($search);
        } else if ($type == 'LEGAL_PERSON') {
            $user = $this->institutionClassifierRepository->findById($search);
        }

        if (!$user) {
            throw new \Exception('validation.user_not_found', 412);
        }

        return $user;
    }

    public function select()
    {
        return $this->thematicUserGroupRepository->select();
    }

    private function updateOrderStatus($id)
    {
        $services = $this->geoProductServiceRepository->findBy('thematic_user_group_id', $id, true);

        $classifierValue = $this->classifierValueRepository->getClassifierValueByCodes('KL19', 'INACTIVE');

        foreach ($services as $service) {
            if ($service->license_type === GeoProductLicenceTypes::PREDEFINED && $service->payment_type === GeoProductPaymentType::FREE) {
                $orders = $this->geoProductOrderRepository->findBy('geo_product_service_id', $service->id, true);

                $this->updateStatus($orders, $classifierValue);
            }
        }

        $files = $this->geoProductFileRepository->findBy('thematic_user_group_id', $id, true);

        foreach ($files as $file) {
            if ($file->license_type === GeoProductLicenceTypes::PREDEFINED && $file->payment_type === GeoProductPaymentType::FREE) {
                $orders = $this->geoProductOrderRepository->findBy('geo_product_service_id', $file->id, true);

                $this->updateStatus($orders, $classifierValue);
            }
        }
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
