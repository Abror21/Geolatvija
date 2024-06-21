<?php

namespace App\Services;

use App\Enums\SystemSettingTypes;
use App\Repositories\SystemSettingRepository;



class SystemSettingFileService extends BaseService
{


    public function __construct
    (
        private SystemSettingRepository $systemSettingRepository,
    )
    {
    }


    public function index($options)
    {
        return $this->systemSettingRepository->getSystemSettingFileList($options);
    }

    public function show($id)
    {
        $setting = $this->systemSettingRepository->findById($id);

        if ($setting->setting_type != SystemSettingTypes::FILE_FORMAT) {
            throw new \Exception('validations.invalid_call');
        }

        return $setting;
    }

    public function update($id, $data)
    {
        $setting = $this->systemSettingRepository->findById($id);

        if ($setting->setting_type != SystemSettingTypes::FILE_FORMAT) {
            throw new \Exception('validations.invalid_call');
        }

        return $this->systemSettingRepository->update($id, $data);
    }

    public function store($data)
    {
        return $this->systemSettingRepository->store($data);
    }

    public function delete($ids): bool
    {
        foreach ($ids as $id) {

            $setting = $this->systemSettingRepository->findById($id);

            if ($setting->setting_type != SystemSettingTypes::FILE_FORMAT) {
                throw new \Exception('validations.invalid_call');
            }

            $setting->delete();
        }

        return true;
    }

    public function sizeShow()
    {
        return $this->systemSettingRepository->findBy('setting_type', SystemSettingTypes::FILE_SIZE);
    }

    public function sizeUpdate($size)
    {
        $setting = $this->systemSettingRepository->findBy('setting_type', SystemSettingTypes::FILE_SIZE);

        $setting->value = $size;
        $setting->update();

        return $setting;
    }

}
