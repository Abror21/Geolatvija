<?php

namespace App\Traits;
use Illuminate\Http\Response;

trait ResponseMessages {

    use RequestResponseHelpers;

    /**
     * @param $message
     * @param $code
     * @param array $headers
     * @return \Illuminate\Http\JsonResponse
     */
    public function errorResponse($message, $code, array $headers = [])
    {
        $responseHeaders = array_merge($this->getDefaultResponseHeaders(), $headers);

        if ($code > 512 || $code < 400) {
            return response()->json(['error' => $message, 'code' => 500], 500, $responseHeaders);
        }

        return response()->json(['error' => $message, 'code' => $code], $code, $responseHeaders);

    }

    /**
     * @param $data
     * @param int $code
     * @param array $headers
     * @return Response
     */
    public function successResponse($data, $code = Response::HTTP_OK, array $headers = [])
    {

        $data = $this->removeUnnecessaryData($data);
        $responseHeaders = array_merge($this->getDefaultResponseHeaders(), $headers);

        return new response($data, $code, $responseHeaders);
    }

    /**
     * @param array $validationMessages
     * @param int $code
     * @param array $headers
     * @return \Illuminate\Http\JsonResponse
     */
    public function validationResponse(array $validationMessages, int $code = 422, array $headers = [])
    {
        $responseHeaders = array_merge($this->getDefaultResponseHeaders(), $headers);
        return response()->json($validationMessages, $code, $responseHeaders);
    }

    /**
     * @param $data
     * @return mixed
     */
    public function removeUnnecessaryData($data)
    {
        if(isset($data['lastPageUrl'])) {
            unset($data['lastPageUrl']);
        }

        if(isset($data['firstPageUrl'])) {
            unset($data['firstPageUrl']);
        }

        if(isset($data['links'])) {
            unset($data['links']);
        }

        if(isset($data['path'])) {
            unset($data['path']);
        }

        if(isset($data['from'])) {
            unset($data['from']);
        }

        if(isset($data['nextPageUrl']) && $data['nextPageUrl'] != null) {
            $data['nextPageUrl'] = true;
        }

        if(isset($data['prevPageUrl']) && $data['prevPageUrl'] != null) {
            $data['prevPageUrl'] = true;
        }

        return $data;
    }
}
