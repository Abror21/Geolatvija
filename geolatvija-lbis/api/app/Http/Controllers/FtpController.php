<?php

namespace App\Http\Controllers;

use App\Http\Requests\FtpStoreRequest;
use App\Services\FtpService;
use App\Traits\ResponseMessages;

class FtpController extends Controller
{
    use ResponseMessages;

    public function __construct( private readonly FtpService $ftpService)
    {
    }

    /**
     * @description Load FTP Files
     */
    public function loadFtpFiles(FtpStoreRequest $request)
    {
        $validated = $request->validated();

        $response = $this->ftpService->loadFtpFiles($this->camelToSnakeArrayKeys($validated));

        return $this->successResponse(['files' => $response]);
    }

    /**
     * @param $id
     * @return \Illuminate\Http\Response
     * @throws \Exception
     * @description Save File
     */
    public function save($id)
    {
        $response = $this->ftpService->saveFiles($id);

        return $this->successResponse($response);
    }

    /**
     * @param $id
     * @return \Illuminate\Http\Response
     * @throws \Exception
     * @description Get Files
     */
    public function getFiles($id)
    {
        $response = $this->ftpService->getFiles($id);

        return $this->successResponse($this->snakeToCamelArrayKeys($response));
    }


}
