<?php

namespace App\Http\Controllers;

use App\Services\StorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Class StorageController
 * @package App\Http\Controllers
 */
class StorageController extends Controller
{
    public function __construct(
        private StorageService $storageService
    )
    {
    }

    /**
     * @param Request $request
     * @return JsonResponse|Response
     * @description Store File (S3)
     */
    public function store(Request $request): Response|JsonResponse
    {
        $filename = $this->storageService->storeFile($request->file, $request->input('bucket'));

        return $this->successResponse($filename);
    }

    /**
     * @param Request $request
     *
     *
     *
     * @return StreamedResponse|JsonResponse
     * @throws \Exception
     * @description Get File (S3)
     */
    public function show(Request $request): StreamedResponse|JsonResponse
    {
        $rename = $request->input('rename');
        $filename = $request->input('file');
        $bucket = $request->input('bucket');

        return $this->storageService->show($rename, $filename, $bucket);
    }

    /**
     * @description Download file (S3)
     */
    public function downloadFile($id)
    {
        return $this->storageService->getFile($id);
    }



}
