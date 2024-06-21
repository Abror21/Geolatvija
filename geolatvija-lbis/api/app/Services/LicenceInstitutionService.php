<?php

namespace App\Services;

use App\Exceptions\ExceptionWithAttributes;
use App\Repositories\AttachmentRepository;
use App\Repositories\GeoProducts\GeoProductFileRepository;
use App\Repositories\GeoProducts\GeoProductServiceRepository;
use App\Repositories\InstitutionLicenceRepository;
use App\Repositories\LicenceTemplateRepository;

class LicenceInstitutionService extends BaseService
{


    public function __construct
    (
        private InstitutionLicenceRepository $institutionLicenceRepository,
        private LicenceTemplateRepository $licenceTemplateRepository,
        private StorageService $storageService,
        private AttachmentRepository $attachmentRepository,
        private GeoProductServiceRepository $geoProductServiceRepository,
        private GeoProductFileRepository $geoProductFileRepository,
    )
    {
    }

    public function index($options)
    {
        return $this->institutionLicenceRepository->getInstitutionLicenceList($options);
    }

    public function show($id)
    {
        $licenceTemplate = $this->institutionLicenceRepository->findById($id);

        if ($licenceTemplate->attachment_id) {
            $attachment = $this->attachmentRepository->findById($licenceTemplate->attachment_id);
            $licenceTemplate->file = [$attachment->toArray()];
        }

        return $licenceTemplate;
    }

    public function update($id, $data)
    {
        $existingTemplate = $this->institutionLicenceRepository->findById($id);

        if (isset($data['selected_template_id'])) {
            $template = $this->licenceTemplateRepository->findById($data['selected_template_id']);

            if (isset($template->$template->attachment_id)) {
                $data['file'] = $this->storageService->getFile($template->attachment_id);
            }
        }

        if (isset($data['file']) && $data['file']) {
            if (isset($data['selected_template_id'])) {
                $template = $this->licenceTemplateRepository->findById($data['selected_template_id']);
                $attachment = $this->attachmentRepository->findById($template->attachment_id);
                $this->storageService->storeFile($data['file'], 'licence', $attachment->display_name);
            } else {
                $attachment = $this->storageService->storeFile($data['file'], 'licence');
            }
            $data['attachment_id'] = $attachment->id;

            $licenceTemplate = $this->institutionLicenceRepository->update($id, $data);

            if ($existingTemplate->attachment_id && !isset($data['selected_template_id']) &&
                !$this->licenceTemplateRepository->getTemplate($existingTemplate->attachment_id)) {
                $this->storageService->deleteFile($existingTemplate->attachment_id);
            }

            return $licenceTemplate;
        }

        if (isset($data['to_be_deleted']) && $existingTemplate->attachment_id && $existingTemplate->attachment_id == $data['to_be_deleted']) {
            $existingTemplate->attachment_id = null;
            $existingTemplate->update();
            $this->storageService->deleteFile($data['to_be_deleted']);
        }

        return $this->institutionLicenceRepository->update($id, $data);
    }

    public function store($data)
    {
        $activeRole = $this->institutionLicenceRepository->activeRole();

        if (!$activeRole->institution_classifier_id) {
            throw new \Exception('validation.institution_not_selected', 412);
        }

        $data['institution_classifier_id'] = $activeRole->institution_classifier_id;

        if (isset($data['file']) && $data['file']) {
            $attachment = $this->storageService->storeFile($data['file'], 'licence');
            $data['attachment_id'] = $attachment->id;
        } else if (isset($data['selected_template_id']) && $data['selected_template_id']) {
            $template = $this->licenceTemplateRepository->findById($data['selected_template_id']);

            $data['attachment_id'] = $template->attachment_id;
        }

        return $this->institutionLicenceRepository->store($data);
    }

    public function delete($ids): bool
    {
        $templates = $this->institutionLicenceRepository->deleteMultiple($ids);

        foreach ($templates as $template) {
            $template->delete();

            if ($template->attachment_id) {
                $this->storageService->deleteFile($template->attachment_id);
            }
        }

        return true;
    }


    public function public($id, $isPublic)
    {
        if (!$isPublic) {
            $licences = $this->geoProductServiceRepository->checkLicence($id);
            $fileLicences = $this->geoProductFileRepository->checkLicence($id);

            $complete = array_merge($licences->where('is_public', true)->pluck('name')->toArray(), $fileLicences->where('is_public', true)->pluck('name')->toArray());

            if (count($complete)) {
                throw new ExceptionWithAttributes(json_encode(['error' => 'validation.active_services', 'attributes' => [
                    'ids' => join(', ', $complete)
                ]]), 412);
            }

            foreach ($licences as $licence) {
                $licence->institution_licence_id = null;
                $licence->update();
            }

            foreach ($fileLicences as $licence) {
                $licence->institution_licence_id = null;
                $licence->update();
            }
        }

        return $this->institutionLicenceRepository->update($id, ['is_public' => $isPublic]);
    }

    public function select($type)
    {
        return $this->institutionLicenceRepository->select($type);
    }


}
