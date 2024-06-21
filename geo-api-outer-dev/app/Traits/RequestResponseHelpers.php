<?php

namespace App\Traits;

trait RequestResponseHelpers {

    public function systemVersion(): string
    {
        $version = trim(getenv('APP_VERSION') ?: exec("git describe --abbrev=0"));

        if($version == "") {
            $version = "0.0.0"; // if no tags, then default version is 0.0.0
        }

        return $version;
    }

    /**
     * Generates unique UUID
     * http://php.net/manual/en/function.uniqid.php#94959
     * @return string
     */
    public function generateUUIDv4() : string {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',

            // 32 bits for "time_low"
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),

            // 16 bits for "time_mid"
            mt_rand(0, 0xffff),

            // 16 bits for "time_hi_and_version",
            // four most significant bits holds version number 4
            mt_rand(0, 0x0fff) | 0x4000,

            // 16 bits, 8 bits for "clk_seq_hi_res",
            // 8 bits for "clk_seq_low",
            // two most significant bits holds zero and one for variant DCE1.1
            mt_rand(0, 0x3fff) | 0x8000,

            // 48 bits for "node"
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
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
            'X-BACKEND-ROUTE' => request()->path(),
            'X-CLIENT-IP' => request()->header('x-forwarded-for'),
            'X-USER-AGENT' => request()->header('user-agent'),
            'X-SEC-CH-UA-MOBILE' => request()->header('sec-ch-ua-mobile'),
            'X-SEC-CH-UA' => request()->header('sec-ch-ua'),
            'X-USER-ID' => request()->header('X-USER-ID'),
            'X-ROLE-ID' => request()->header('X-ROLE-ID'),
            'X-LANGUAGE' => request()->header('X-LANGUAGE'),
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
