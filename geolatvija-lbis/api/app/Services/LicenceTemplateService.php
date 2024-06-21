<?php

namespace App\Services;

use App\Repositories\AttachmentRepository;
use App\Repositories\LicenceMaskRepository;
use App\Repositories\LicenceTemplateRepository;
class LicenceTemplateService extends BaseService
{


    public function __construct
    (
        private LicenceTemplateRepository $licenceTemplateRepository,
        private LicenceMaskRepository $licenceMaskRepository,
        private StorageService $storageService,
        private AttachmentRepository $attachmentRepository,
    )
    {
    }

    public function index($options)
    {
        return $this->licenceTemplateRepository->getLicenceTemplateList($options);
    }

    public function show($id)
    {
        $licenceTemplate = $this->licenceTemplateRepository->findById($id);

        if ($licenceTemplate->attachment_id) {
            $attachment = $this->attachmentRepository->findById($licenceTemplate->attachment_id);
            $licenceTemplate->file = [$attachment->toArray()];
        }

        return $licenceTemplate;
    }

    public function update($id, $data)
    {
        $existingTemplate = $this->licenceTemplateRepository->findById($id);

        if (isset($data['file']) && $data['file']) {

            $attachment = $this->storageService->storeFile($data['file'], 'licence');

            $data['attachment_id'] = $attachment->id;

            $licenceTemplate = $this->licenceTemplateRepository->update($id, $data);

            if ($existingTemplate->attachment_id) {
                $this->storageService->deleteFile($existingTemplate->attachment_id);
            }

            return $licenceTemplate;
        }

        if (isset($data['to_be_deleted']) && $existingTemplate->attachment_id && $existingTemplate->attachment_id == $data['to_be_deleted']) {
            $existingTemplate->attachment_id = null;
            $existingTemplate->update();
            $this->storageService->deleteFile($data['to_be_deleted']);
        }

        return $this->licenceTemplateRepository->update($id, $data);
    }

    public function store($data)
    {
        if (isset($data['file']) && $data['file']) {
            $attachment = $this->storageService->storeFile($data['file'], 'licence');
            $data['attachment_id'] = $attachment->id;
        }

        $data['type'] = 'TEMPLATE';

        return $this->licenceTemplateRepository->store($data);
    }

    public function delete($ids): bool
    {
        $templates =  $this->licenceTemplateRepository->deleteMultiple($ids);

        foreach ($templates as $template) {
            $template->delete();

            if ($template->attachment_id) {
                $this->storageService->deleteFile($template->attachment_id);
            }
        }


        return true;
    }

    public function masks()
    {
        return $this->licenceMaskRepository->list();
    }

    public function public($id, $isPublic)
    {
        return $this->licenceTemplateRepository->update($id, ['is_public' => $isPublic]);
    }

}
