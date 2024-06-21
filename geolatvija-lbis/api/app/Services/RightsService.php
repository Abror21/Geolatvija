<?php

namespace App\Services;

use App\Repositories\AttachmentRepository;
use App\Repositories\RightRepository;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use App\Enums\UserTypes;

/**
 * Class RightsService
 * @package App\Services
 */
class RightsService extends BaseService
{
    public function __construct(
        private RightRepository $rightRepository,
    )
    {
    }

    public function getRights()
    {
        return $this->rightRepository->getRights();
    }

    public function update($options)
    {
        return $this->rightRepository->updateMultiple($options);
    }
}
