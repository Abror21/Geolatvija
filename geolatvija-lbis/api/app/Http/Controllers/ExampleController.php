<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaginationRequest;
use App\Models\User;
use App\Repositories\GeoProducts\GeoProductRepository;
use App\Services\ExampleService;
use App\Services\MetadataService;
use Carbon\Carbon;
use DOMDocument;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Traits\ResponseMessages;
use Illuminate\Support\Facades\Hash;
use SimpleXMLElement;

/**
 * Class AuthController
 * @package App\Http\Controllers
 */
class ExampleController extends Controller
{

    use ResponseMessages;

    /**
     * AuthController constructor.
     * @param ExampleService $exampleService
     */
    public function __construct(private ExampleService $exampleService, private MetadataService $metadataService, private GeoProductRepository $geoProductRepository)
    {
    }

    /**
     * @param Request $request
     * @return JsonResponse|Response
     * @description Get Example
     */
    public function example(Request $request)
    {

        $geoProduct = $this->geoProductRepository->findById(1);

        $this->metadataService->createMetadata($geoProduct, false);


        return 'yes';

        $data = $request->only(['test']);

        $exampleData = $this->exampleService->example([$data]);

        $test = [
            "data" => [
                [
                    "id" => 1,
                    "name" => 'test',
                    "type" => 'test',
                    'status' => 'new',
                    'statusUpdatedAt' => Carbon::now(),
                ],
                [
                    "id" => 2,
                    "name" => 'test',
                    "type" => 'test',
                    'status' => 'new',
                    'statusUpdatedAt' => Carbon::now(),
                ],
                [
                    "id" => 3,
                    "name" => 'test',
                    "type" => 'test',
                    'status' => 'new',
                    'statusUpdatedAt' => Carbon::now(),
                ],
                [
                    "id" => 4,
                    "name" => 'test',
                    "type" => 'test',
                    'status' => 'new',
                    'statusUpdatedAt' => Carbon::now(),
                ],
                [
                    "id" => 5,
                    "name" => 'test',
                    "type" => 'test',
                    'status' => 'new',
                    'statusUpdatedAt' => Carbon::now(),
                ],
                [
                    "id" => 6,
                    "name" => 'test',
                    "type" => 'test',
                    'status' => 'new',
                    'statusUpdatedAt' => Carbon::now(),
                ],
            ]
        ];

        return $this->successResponse($test);
    }



    /**
     * @description Get dummy data
     */
    public function dummy(PaginationRequest $request): Response
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());

        $organizations = $this->exampleService->dummy($options);

        return $this->successResponse($this->snakeToCamelArrayKeys($organizations->toArray()));
    }

    /**
     * @description Login (Create token) (Example)
     */
    public function login()
    {
        $user = User::first();

        $token = $user->createToken('SAML');

        return $token;
    }


}
