<?php

namespace App\Services;

use App\Repositories\GeoProductOrderRepository;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OrderedLicenceService extends BaseService
{


    public function __construct
    (
        private GeoProductOrderRepository $geoProductOrderRepository,
        private StorageService $storageService
    )
    {
    }

    public function index($options)
    {
        $orderedLicences = $this->geoProductOrderRepository->getOrderedLicences($options);

        foreach ($orderedLicences as $orderedLicence) {
            $orderedLicence->personal_code = Str::mask($orderedLicence->personal_code, '*', -8, 6);
        }

        return $orderedLicences;
    }

    /**
     * @param $id
     * @return JsonResponse|StreamedResponse
     * @throws Exception
     */
    public function download($id): JsonResponse|StreamedResponse
    {
        $order = $this->geoProductOrderRepository->getHolderOrder($id);

        $activeRole = $this->geoProductOrderRepository->activeRole();

        if ($activeRole->user_id != $order->role->user_id) {
            throw new Exception('validation.order_doesnt_belong_to_role');
        }

        return $this->storageService->getFile($order->accepted_licence_attachment_id);
    }
}
