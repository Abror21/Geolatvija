<?php

namespace App\Repositories;

use App\Enums\SystemSettingTypes;
use App\Models\SystemSetting;
use Illuminate\Database\Eloquent\Model;


class SystemSettingRepository extends BaseRepository
{


    public function __construct(SystemSetting $systemSetting)
    {
        parent::__construct($systemSetting);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new SystemSetting();
    }

    public function getSystemSettingList($options)
    {
        return SystemSetting::select('system_settings.*')
            ->where('setting_type', SystemSettingTypes::REGULAR)
            ->paginate($options['pageSize'] ?? 10);
    }

    public function getSystemSettingFileList($options)
    {
        return SystemSetting::select('system_settings.*')
            ->where('setting_type', SystemSettingTypes::FILE_FORMAT)
            ->paginate($options['pageSize'] ?? 10);
    }
}
