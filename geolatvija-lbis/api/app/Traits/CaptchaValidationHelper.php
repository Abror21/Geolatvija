<?php

namespace App\Traits;

use Illuminate\Http\Request;

trait CaptchaValidationHelper
{
    public function validateCaptcha($recaptchaKey): bool
    {
        $recaptchaResponse = $recaptchaKey;

        $secretKey = env('SECRET_CAPTCHA_KEY');

        $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$secretKey}&response={$recaptchaResponse}");

        $body = json_decode($response, true);

        if ($body['success'] !== true) {
            throw new \Exception('plugins.captcha.failed');
        }

        return $body['success'];
    }
}
