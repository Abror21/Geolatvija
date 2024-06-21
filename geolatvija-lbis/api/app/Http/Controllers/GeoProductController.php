<?php

namespace App\Http\Controllers;

use App\Events\OtherProductCallEvent;
use App\Events\ProductViewEvent;
use App\Http\Requests\CheckInspireRequest;
use App\Http\Requests\GeoProductStoreRequest;
use App\Http\Requests\PaginationRequest;
use App\Imports\EmbedImport;
use App\Imports\GeoProductImport;
use App\Services\GeoProductService;
use App\Services\SystemSettingService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Traits\ResponseMessages;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class GeoProductController extends Controller
{

    use ResponseMessages;

    /**
     * GeoProductController constructor.
     * @param GeoProductService $geoProductService
     */
    public function __construct(private GeoProductService $geoProductService, private SystemSettingService $systemSettingService, private GeoProductImport $geoProductImport)
    {
    }

    /**
     * @description Get list of Geo Products
     */
    public function getGeoproducts(PaginationRequest $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $geoProducts = $this->geoProductService->getGeoproducts($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($geoProducts->toArray()));
    }

    /**
     * @description Get Geo Product
     */
    public function getGeoproduct($id): Response
    {
        $geoProducts = $this->geoProductService->getGeoproduct($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($geoProducts->toArray()));
    }

    /**
     * @description Check Inspire validation
     */
    public function checkInspireValidation(CheckInspireRequest $request, $id): Response
    {
        $inspireResponse = $this->geoProductService->checkInspireValidation($request->geoProductId, $id);

        return $this->successResponse(($inspireResponse));
    }

    /**
     * @description Create Geo Product
     */
    public function store(GeoProductStoreRequest $request): Response
    {
        $params = $this->camelToSnakeArrayKeys($request->validated());

        $geoProduct = $this->geoProductService->store($params);

        return $this->successResponse($this->snakeToCamelArrayKeys($geoProduct->toArray()));
    }

    /**
     * @description Update Geo Product
     */
    public function updateGeoproduct(GeoProductStoreRequest $request, $id): Response
    {
        $params = $this->camelToSnakeArrayKeys($request->validated());

        $geoProduct = $this->geoProductService->updateGeoproduct($params, $id);

        return $this->successResponse($this->snakeToCamelArrayKeys($geoProduct->toArray()));
    }

    /**
     * @description Get DPPS Capabilities
     */
    public function dppsCapabilities($id, $dppsUuid, Request $request): Response
    {
        $dppsCapabilities = $this->geoProductService->dppsCapabilities($id, $dppsUuid, $request->all());

        return $this->successResponse($dppsCapabilities);
    }

    /**
     * @description Publish Geo Product
     */
    public function publishGeoproduct(Request $request, $id): Response
    {
        $data = $this->camelToSnakeArrayKeys($request->only(['publicFrom', 'publicTo']));

        $geoProduct = $this->geoProductService->publishGeoproduct($data, $id);

        return $this->successResponse($this->snakeToCamelArrayKeys($geoProduct->toArray()));
    }

    /**
     * @description Unpublish Geo Product
     */
    public function unpublishGeoproduct($id): Response
    {
        $geoProduct = $this->geoProductService->unpublishGeoproduct($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($geoProduct->toArray()));
    }

    /**
     * @description Copy Geo Product
     */
    public function copyGeoproduct($id): Response
    {
        $geoProduct = $this->geoProductService->copyGeoproduct($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($geoProduct->toArray()));
    }

    /**
     * @description Delete Geo Products by IDs
     */
    public function delete(Request $request): Response
    {
        $userGroups = $this->geoProductService->deleteMultiple($request->input('ids'));

        return $this->successResponse('Success');
    }

    /**
     * @description Get published Geo Products
     */
    public function getPublicGeoproducts(PaginationRequest $request): Response
    {
        if ($this->systemSettingService->isCaptchaSet()) {
            $this->validateCaptcha($request->get('recaptchaKey'));
        }

        $options = $this->camelToSnakeArrayKeys($request->validated());

        $geoProducts = $this->geoProductService->getPublicGeoproducts($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($geoProducts->toArray()));
    }

    /**
     * @description Get published Geo Products without captcha
     */
    public function getPublicGeoproductsWithoutCaptcha(PaginationRequest $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $geoProducts = $this->geoProductService->getPublicGeoproducts($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($geoProducts->toArray()));
    }

    /**
     * @description Get published Geo Product
     */
    public function getPublicGeoproduct($id): Response
    {
        $geoProducts = $this->geoProductService->getPublicGeoproduct($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($geoProducts->toArray()));
    }

    /**
     * @description Check Service link
     */
    public function checkServiceLink(Request $request): Response
    {
        $isSuccess = $this->geoProductService->checkServiceLink($request->input('serviceLink'), $request->input('serviceTypeClassifierValueId'));

        return $this->successResponse($isSuccess);
    }

    /**
     * @description Get Geo Products for Select field
     */
    public function select(): Response
    {
        $geoProducts = $this->geoProductService->select();

        return $this->successResponse($this->snakeToCamelArrayKeys($geoProducts->toArray()));
    }


    /**
     * @description Get Geo Products for by User
     */
    public function selectGeoProductsByUser(): Response
    {
        $geoProducts = $this->geoProductService->selectGeoProductsByUser();

        return $this->successResponse($this->snakeToCamelArrayKeys($geoProducts->toArray()));
    }

    /**
     * @description Import Geo Product from Excel file
     */
    public function import(): Response
    {
        $file =Storage::disk('local')->get('');

        Excel::import($this->geoProductImport, 'Geomigr.xlsx');

        return $this->successResponse(true);
    }

    /**
     * @description Get Geo Product Other view
     */
    public function otherView($id): Response
    {
        $geoProductOther = $this->geoProductService->otherView($id);

        event(new OtherProductCallEvent($geoProductOther));

        return $this->successResponse(true);
    }


}
