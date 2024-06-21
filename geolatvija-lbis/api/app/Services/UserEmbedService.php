<?php


namespace App\Services;

use App\Repositories\UserEmbedRepository;
use Illuminate\Database\Eloquent\Model;

/**
 * Class NotificationService
 * @package App\Services
 */
class UserEmbedService extends BaseService
{

    public function __construct
    (
        private readonly UserEmbedRepository $userEmbedRepository,
    )
    {
    }

    public function getUserEmbedList($options)
    {
        $activeRole = $this->userEmbedRepository->activeRole();

        return $this->userEmbedRepository->getUserEmbedsList($activeRole->getKey(), $activeRole->institution_classifier_id, $options);

    }

    public function storeUserEmbed($data)
    {
        $activeRole = $this->userEmbedRepository->activeRole();
        $institution = $this->userEmbedRepository->activeInstitution();
        $data['role_id'] = $activeRole->getKey();
        $data['iframe'] = $this->generateIframe($data);
        $data['reg_nr'] = $institution->reg_nr ?? null;

        return $this->userEmbedRepository->store($data);
    }

    public function showUserEmbed($id)
    {
        return $this->validateAccess($id);
    }

    public function uuid($uuid)
    {
        $embed = $this->userEmbedRepository->findBy('uuid', $uuid);

        if (!$embed) {
          return [];
        }

        return $embed->only('name', 'domain', 'width', 'height', 'iframe', 'uuid', 'data');
    }

    public function updateUserEmbed($id, $data): Model
    {
        $this->validateAccess($id);

        $activeRole = $this->userEmbedRepository->activeRole();
        $data['role_id'] = $activeRole->getKey();
        $data['iframe'] = $this->generateIframe($data);

        return $this->userEmbedRepository->update($id, $data);
    }

    public function deleteUserEmbeds($ids): bool
    {
        foreach ($ids as $id) {
            $this->validateAccess($id);
            $userEmbed = $this->userEmbedRepository->findById($id);
            $userEmbed->delete();
        }

        return true;
    }


    public function generateIframe($data) {
        $width = $data['width'];
        $height = $data['height'];
        $uuid = $data['uuid'];

        return '<iframe
        width="' . $width . '"
        scrolling="no"
        height="' . $height . '"
        style="border: 0; overflow: hidden"
        src="'. config('geo.base_frontend_uri') . '/map/?id=' . $uuid .'"
    ></iframe>';
    }

    public function validateAccess($id) {
        $activeRole = $this->userEmbedRepository->activeRole();
        $institution = $this->userEmbedRepository->activeInstitution();

        $embed = $this->userEmbedRepository->findById($id);

        if ($embed->role_id && $embed->role_id === $activeRole->id) {
            return $embed;
        }

        if ($institution->reg_nr === $embed->reg_nr ) {
            return $embed;
        }

        throw new \Exception('validation.not_allowed_to_access_embed');
    }

}
