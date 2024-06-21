<?php


namespace App\Repositories;

use App\Models\InstitutionLicence;
use Illuminate\Database\Eloquent\Model;

class InstitutionLicenceRepository extends BaseRepository
{

    /**
     * InstitutionLicenceRepository constructor.
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


    public function getInstitutionLicenceList($options)
    {
        $role = $this->activeRole();

        return InstitutionLicence::select(['institution_licences.*', 'attachments.display_name as attachment_name'])
            ->leftJoin('attachments', 'attachments.id', '=', 'institution_licences.attachment_id')
            ->where('institution_licences.type', 'LICENCE')
            ->when(!$role->is_admin, function ($query) use ($role) {
                return $query->where('institution_licences.institution_classifier_id', $role->institution_classifier_id);
            })
            ->paginate($options['page_size']);
    }

    public function select($type)
    {
        $role = $this->activeRole();

        return InstitutionLicence::select(['institution_licences.id', 'institution_licences.name'])
            ->when(!$role->is_admin, function ($query) use ($role) {
                return $query->where(function ($query) use ($role) {
                    $query->where('institution_licences.institution_classifier_id', $role->institution_classifier_id)
                        ->orWhereNull('institution_licences.institution_classifier_id');
                });
            })
            ->where('is_public', true)
            ->where('licence_type', $type)
            ->get();
    }

    public function deleteMultiple(array $ids)
    {
        return InstitutionLicence::whereIn('id', $ids)->where('institution_licences.type', 'LICENCE')->get();
    }

    public function findLicenceForImport($site, $licenceType)
    {
        return InstitutionLicence::where('site', $site)->where('licence_type', $licenceType)->first();
    }
}
