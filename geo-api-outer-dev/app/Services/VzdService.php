<?php

namespace App\Services;

use App\Events\InitiateVzdDataTransferEvent;
use App\Jobs\InitiateVzdDataTransfer;
use App\Models\Vzd\Building;
use App\Services\API\VZDAPI;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Shapefile\Shapefile;
use Shapefile\ShapefileReader;
use ZanySoft\Zip\Zip;
use ZanySoft\Zip\ZipManager;

/**
 * Class VzdService
 * @package App\Services
 */
class VzdService
{

    public function __construct(private VZDAPI $VZDAPI)
    {
    }

    public function initiateFileDownload()
    {
        InitiateVzdDataTransferEvent::dispatch();

        return;


    }


}
