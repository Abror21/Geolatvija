<?php

namespace App\Repositories;

use App\Models\Saml2Tenant;
use Illuminate\Database\Eloquent\Model;

class Saml2TenantRepository extends BaseRepository
{

    /**
     * Saml2TenantRepository constructor.
     * @param Saml2Tenant $saml2Tenant
     */
    public function __construct(Saml2Tenant $saml2Tenant)
    {
        parent::__construct($saml2Tenant);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new Saml2Tenant();
    }


    public function getSaml2Entry()
    {
        return Saml2Tenant::first();
    }


}
