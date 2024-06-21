<?php

namespace App\Services;

use App\Repositories\UserGroupRepository;

/**
 * Class UserGroupService
 * @package App\Services
 */
class UserGroupService extends BaseService
{
    public function __construct(
        private UserGroupRepository $userGroupRepository,
    )
    {
    }

    public function getRoles($options)
    {
        return $this->userGroupRepository->getRoles($options);
    }

    public function deleteMultiple($ids)
    {
        return $this->userGroupRepository->deleteMultiple($ids);
    }

    public function store($data)
    {
        $existingGroup = $this->userGroupRepository->findBy('name', $data['name']);

        if ($existingGroup) {
            throw new \Exception('validation.existing_role_group', 412);
        }

        return $this->userGroupRepository->store($data);
    }
    public function update($id, $data)
    {
        $existingGroup = $this->userGroupRepository->findBy('name', $data['name']);

        if ($existingGroup && $existingGroup->id != $id) {
            throw new \Exception('validation.existing_role_group', 412);
        }

        return $this->userGroupRepository->update($id, $data);
    }

    public function show($id)
    {
        return $this->userGroupRepository->findById($id);
    }

    public function userGroupSelect($type)
    {
        $role = $this->userGroupRepository->activeRole();
        $allowedCodes = [];
        if (!$role->is_admin && $type === 'LIMITED') {
            $allowedCodes = match ($role->group_code) {
                'data_owner' => ['institution_admin', 'authenticated'],
                'institution_admin' => ['authenticated'],
                default => ['authenticated'],
            };
        }

        if (!$role->is_admin && $type === 'LIMITED_OWNED') {
            $allowedCodes = match ($role->group_code) {
                'data_owner' => ['institution_admin', 'authenticated', 'data_owner'],
                'institution_admin' => ['authenticated'],
                default => ['authenticated'],
            };

        }

        return $this->userGroupRepository->userGroupSelect($allowedCodes);
    }


}
