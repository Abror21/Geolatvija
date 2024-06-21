<?php

namespace App\Http\Controllers;

use App\Enums\SystemSettingTypes;
use App\Http\Requests\BackgroundTaskStoreRequest;
use App\Http\Requests\PaginationRequest;
use App\Http\Requests\ProcessingTypeStoreRequest;
use App\Services\BackgroundTaskService;
use App\Services\ProcessingTypeService;
use App\Services\StorageService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\File;

class AtomController extends Controller
{


    public function __construct(private StorageService $storageService)
    {
    }

    /**
     * @description Get banner.png
     */
    public function banner()
    {
        $file = File::get(public_path() . '/' . 'banner.png');

        return $this->successResponse($file, 200, ['Content-Type' => 'image/png']);
    }

    /**
     * @description Get ATOM Service CSS styles
     */
    public function serviceCss()
    {
        $content = file_get_contents(public_path() . '/' . 'ATOMServiceCSS.css');
        $content = str_replace('http://proxygds.viss.gov.lv/ATOM_design/banner_new.png', env('APP_URL') . '/api/v1/atom/banner', $content);

        return $this->successResponse($content, 200, ['Content-Type' => 'text/css']);
    }

    /**
     * @description Get ATOM Service Styles (xsl)
     */
    public function serviceStyle()
    {
        $content = file_get_contents(public_path() . '/' . 'ATOMServiceStyle.xsl');
        $content = str_replace('http://proxygds.viss.gov.lv/ATOM_design/ATOMServiceCSS.css', env('APP_URL') . '/api/v1/atom/service-css', $content);

        return $this->successResponse($content, 200, ['Content-Type' => 'text/xml']);
    }

    /**
     * @description Get ATOM
     */
    public function getAtom($uuid)
    {
        $content = $this->storageService->getFileUuid($uuid, true);

        return $this->successResponse($content, 200, ['Content-Type' => 'text/xml']);
    }

    /**
     * @description Download file
     */
    public function downloadFile($uuid)
    {
        return $this->storageService->getFileUuid($uuid);
    }


}
