<?php


namespace App\Repositories;

use App\Models\UserEmailVerification;
use Illuminate\Database\Eloquent\Model;

class UserEmailVerificationRepository extends BaseRepository
{

    /**
     * UserEmailVerificationRepository constructor.
     * @param UserEmailVerification $userEmailVerification
     */
    public function __construct(UserEmailVerification $userEmailVerification)
    {
        parent::__construct($userEmailVerification);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new UserEmailVerification();
    }
}
