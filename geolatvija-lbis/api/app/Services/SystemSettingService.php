<?php

namespace App\Services;

use App\Enums\SystemSettingTypes;
use App\Repositories\SystemSettingRepository;


class SystemSettingService extends BaseService
{


    public function __construct
    (
        private SystemSettingRepository $systemSettingRepository,
    )
    {
    }


    public function index($options)
    {
        return $this->systemSettingRepository->getSystemSettingList($options);
    }

    public function show($id)
    {
        $setting = $this->systemSettingRepository->findById($id);

        //extra protection
        if ($setting->setting_type != SystemSettingTypes::REGULAR) {
            throw new \Exception('validations.invalid_call');
        }

        return $setting;
    }

    public function update($id, $data)
    {
        $setting = $this->systemSettingRepository->findById($id);

        //extra protection
        if ($setting->setting_type != SystemSettingTypes::REGULAR) {
            throw new \Exception('validations.invalid_call');
        }

        return $this->systemSettingRepository->update($id, $data);
    }

    public function frontend()
    {
        $settings = $this->systemSettingRepository->findBy('file_name', 'frontend', true);

        $data = [
            'file_size' => 0,
            'file_format' => []
        ];

        foreach ($settings as $setting) {
            if ($setting->setting_type == SystemSettingTypes::FILE_SIZE) {
                $data['file_size'] = $setting->value;
                continue;
            }

            if ($setting->setting_type == SystemSettingTypes::FILE_FORMAT) {
                $data['file_format'] = array_merge(explode(' ', $setting->value), $data['file_format']);
                continue;
            }

            $data[$setting->key] = $setting->value;
        }

        return $data;
    }

    public function isCaptchaSet(): bool
    {
        $data = $this->systemSettingRepository->findBy('key', 'GEOPRODUCT_CAPTCHA');
        if ($data->value === "1") {
            return true;
        }
        return false;
    }

    public function getSessionInactivityTime()
    {
        return $this->systemSettingRepository->findBy('key', 'SESSION_INACTIVITY_TIME');
    }

    public function getDivFileDownloadAvailabilityDuration()
    {
        return $this->systemSettingRepository->findBy('key', 'div_file_download_availability_duration');
    }

    public function getSessionInactivityTokenTime()
    {
        return $this->systemSettingRepository->findBy('key', 'SESSION_INACTIVITY_TOKEN_TIME');
    }

    public function captchaShow(): array
    {
        $data['geoproduct'] = $this->systemSettingRepository->findBy('key', 'GEOPRODUCT_CAPTCHA');

        return $data;
    }

    public function captchaUpdate($geoproductCaptchaValue): array
    {
        $data['geoproduct'] = $this->systemSettingRepository->findBy('key', 'GEOPRODUCT_CAPTCHA');

        $data['geoproduct']->value = $geoproductCaptchaValue;

        $data['geoproduct']->update();

        return $data;
    }
}
