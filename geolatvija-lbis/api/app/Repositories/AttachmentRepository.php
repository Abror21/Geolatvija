<?php


namespace App\Repositories;

use App\Models\Attachment;
use Illuminate\Database\Eloquent\Model;

class AttachmentRepository extends BaseRepository
{

    /**
     * AttachmentRepository constructor.
     * @param Attachment $attachment
     */
    public function __construct(Attachment $attachment)
    {
        parent::__construct($attachment);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new Attachment();
    }

    public function findSpecificFile($displayName, $bucket, $geoProductFileId)
    {
        return Attachment::where('display_name', $displayName)->where('bucket', $bucket)->where('geo_product_file_id', $geoProductFileId)->first();
    }

    public function getFiles($id)
    {
        return $this->create()
            ->select(
                [
                    'attachments.display_name as name',
                    'attachments.created_at',
                    'geo_product_files_ftp.zip_id'
                ]
            )
            ->leftJoin('geo_product_files_ftp', 'geo_product_files_ftp.attachment_id', '=', 'attachments.id')
            ->where('attachments.geo_product_file_id', $id)
            ->get();
    }
}
