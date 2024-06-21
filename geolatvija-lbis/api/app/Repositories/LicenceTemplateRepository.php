<?php


namespace App\Repositories;

use App\Models\InstitutionLicence;
use Illuminate\Database\Eloquent\Model;

class LicenceTemplateRepository extends BaseRepository
{

    /**
     * LicenceTemplateRepository constructor.
     * @param InstitutionLicence $institutionLicence
     */
    public function __construct(InstitutionLicence $institutionLicence)
    {
        parent::__construct($institutionLicence);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new InstitutionLicence;
    }


    public function getLicenceTemplateList($options)
    {
        $role = $this->activeRole();

        return InstitutionLicence::select(['institution_licences.*', 'attachments.display_name as attachment_name'])
            ->leftJoin('attachments', 'attachments.id', '=', 'institution_licences.attachment_id')
            ->where('institution_licences.type', 'TEMPLATE')
            ->when(!$role->is_admin, function ($query) use ($role) {
                return $query->where('institution_licences.is_public', true);
            })
            ->paginate($options['page_size']);
    }

    public function deleteMultiple(array $ids)
    {
        return InstitutionLicence::whereIn('id', $ids)->where('institution_licences.type', 'TEMPLATE')->get();
    }

    public function getTemplate($id)
    {
        return InstitutionLicence::select(['institution_licences.attachment_id'])
            ->where('institution_licences.type', 'TEMPLATE')
            ->where('licence_templates.attachment_id', '=', $id);
    }
}
