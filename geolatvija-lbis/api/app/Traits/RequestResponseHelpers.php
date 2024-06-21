<?php

namespace App\Traits;

trait RequestResponseHelpers {

    use CommonHelper;
    public function systemVersion(): string
    {
        $version = trim(getenv('APP_VERSION'));

        if($version == "") {
            $version = "0.0.0"; // if no tags, then default version is 0.0.0
        }

        return $version;
    }

    /**
     * @return array
     */
    public function getDefaultRequestHeaders(): array
    {
        return [
            'content-type' => 'application/json',
            'X-REQUEST-UUID' => $this->generateUUIDv4(),
            'X-REQUEST-Timestamp' => time(),
            'X-SYSTEM-VERSION' => $this->systemVersion(),
            'X-FRONTEND-ROUTE' => request()->header('X-FRONTEND-ROUTE'),
        ];
    }

    /**
     * @return array
     */
    public function getDefaultResponseHeaders(): array
    {
        return [
            'content-type' => 'application/json',
            'X-RESPONSE-UUID' => request()->header('X-Request-UUID'),
            'X-RESPONSE-TIMESTAMP' => time(),
            'X-SYSTEM-VERSION' => $this->systemVersion(),
        ];
    }

    /**
     * prepends and appends asterix (*) to searchable word
     * So search works that contains the words.
     *
     * @param array $data
     * @return array
     */
    public function wildcardSearch(array $data) : array
    {
        $returnData = [];
        foreach($data as $key => $value) {
            if($value && !empty($value)) {
                $returnData[$key] = '*' . $value . '*';
            }
        }

        return $returnData;
    }

    /**
     * Each searchable array element separates with tide
     *
     * From docs:
     * Query (?status=ACTIVE~INACTIVE) will only return resources that have
     * a status equal to either ACTIVE OR INACTIVE
     *
     * @param array $data
     * @return array
     */
    public function multiValueSearch(array $data) : array
    {
        $returnData = [];
        foreach($data as $key => $value) {
            if($value && !empty($value)) {
                $returnData[$key] = implode('~', $value);
            }
        }

        return $returnData;
    }
}
