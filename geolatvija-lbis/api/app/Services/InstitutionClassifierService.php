<?php

namespace App\Services;

use App\Exceptions\InvalidAction;
use App\Repositories\GeoProductOrderRepository;
use App\Repositories\GeoProducts\GeoProductRepository;
use App\Repositories\InstitutionClassifierRepository;
use App\Repositories\ProcessingTypeRepository;
use App\Repositories\RoleRepository;
use App\Repositories\ThematicUserGroupRepository;
use Illuminate\Database\Eloquent\Model;

class InstitutionClassifierService extends BaseService
{

    /**
     * InstitutionClassifierService constructor.
     * @param InstitutionClassifierRepository $institutionClassifierRepository
     */
    public function __construct(
        private readonly InstitutionClassifierRepository $institutionClassifierRepository,
        private readonly RoleRepository $roleRepository,
        private readonly ProcessingTypeRepository $processingTypeRepository,
        private readonly GeoProductRepository $geoProductRepository,
        private readonly ThematicUserGroupRepository $thematicUserGroupRepository,
        private readonly GeoProductOrderRepository $geoProductOrderRepository,
    ) {}

    public function index($options)
    {
        return $this->institutionClassifierRepository->getInstitutionClassifierList($options);
    }

    public function update($classifierValueId, $data): Model
    {
        $existing = $this->institutionClassifierRepository->findBy('reg_nr', $data['reg_nr']);

        if (isset($existing) && $existing->id != $classifierValueId) {
            throw new InvalidAction('validation.reg_nr_not_unique', 412);
        }

        return $this->institutionClassifierRepository->update($classifierValueId, $data);
    }

    public function store($data): Model
    {
        $existing = $this->institutionClassifierRepository->findBy('reg_nr', $data['reg_nr']);

        if ($existing) {
            throw new InvalidAction('validation.reg_nr_not_unique', 412);
        }

        return $this->institutionClassifierRepository->store($data);
    }

    public function show($classifierValueId): Model
    {
        return $this->institutionClassifierRepository->findById($classifierValueId);
    }

    public function select($type)
    {
        $institutionClassifierIds = [];

        $role = $this->institutionClassifierRepository->activeRole();
        if ((!$role->is_admin && !$role->is_data_owner) && $type === 'LIMITED') {
            $roles = $this->institutionClassifierRepository->roles();

            $institutionClassifierIds = $roles->pluck('institution_classifier_id')->toArray();
        }

        if (!$role->is_admin && $type === 'LIMITED_OWNED') {
            $roles = $this->roleRepository->findBy('created_by_role_id', $role->id, true);

            $institutionClassifierIds = $roles->pluck('institution_classifier_id')->toArray();
            $institutionClassifierIds[] = $role->institution_classifier_id;
        }

        if (!$role->is_admin && $type === 'LIMITED_BY_DT_ORDERS') {
            $ordersInstitutionClassifierIds = $this->geoProductOrderRepository->getAllOrdersForSelectsByInstitution()->pluck('institution_classifier_id')->toArray();

            $institutionClassifierIds = $ordersInstitutionClassifierIds;
        }

        if (!$role->is_admin && !$role->is_data_owner && $type === 'USER_MANAGEMENT') {
            $institutionClassifierIds[] = $role->institution_classifier_id;
        }


        return $this->institutionClassifierRepository->select($institutionClassifierIds);
    }


    public function deleteInstitutionClassifiers($ids): bool
    {
        foreach ($ids as $id) {
            $institution = $this->institutionClassifierRepository->findById($id);

            $this->validateInstitutionClassifierDeletion($institution);

            $institution->delete();
        }

        return true;
    }

    private function validateInstitutionClassifierDeletion($institutionClassifier)
    {
        $repositories = [
            'Role' => $this->roleRepository,
            'ProcessingType' => $this->processingTypeRepository,
            'GeoProduct' => $this->geoProductRepository,
            'ThematicUserGroup' => $this->thematicUserGroupRepository,
        ];

        foreach ($repositories as $repositoryName => $repository) {
            $fieldName = ($repositoryName === 'GeoProduct' || $repositoryName === 'ThematicUserGroup')
                ? 'owner_institution_classifier_id'
                : 'institution_classifier_id';

            $result = $repository->findBy($fieldName, $institutionClassifier->id);

            if ($result) {
                throw new \Exception('validation.institution_classifier_delete');
            }
        }

        $orders = $this->geoProductOrderRepository->getOrdersForInstitutionClassifierDeletion($institutionClassifier->id);

        if ($orders->isNotEmpty()) {
            throw new \Exception('validation.institution_classifier_delete');
        }
    }

}
