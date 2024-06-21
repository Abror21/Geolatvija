<?php

namespace App\Providers;

use App\Models\SystemSetting;
use App\Traits\BuildMacroHelper;
use Illuminate\Queue\Events\JobFailed;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Builder;

class AppServiceProvider extends ServiceProvider
{

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        if (env("TELESCOPE_ENABLED", false)) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        if (env("SQL_DEBUG_LOG"))
        {
            DB::listen(function ($query) {
                Log::info(
                    $query->sql, $query->bindings
                );
            });

        }

        Queue::failing(function (JobFailed $event){
//            Log::channel('mattermost')->error('Queue failed - ' . $event->exception->getMessage());
        });

        Builder::macro('search', function($settings, $filter) {
            $helper = new BuildMacroHelper();

            return $helper->searchMacro($this, $settings, $filter);
        });

        if (env("LOAD_CONFIGURATION_FROM_DB", false)) {
            $this->loadServiceSettings();
        }
    }


    /**
     *  Load configuration from database
     */
    private function loadServiceSettings(): void
    {
        $systemSettingsValues = SystemSetting::getAllSystemSettingValueBySystemName("MW");

        $settings = [];

        foreach ($systemSettingsValues as $systemSettingValue) {
            $settings[$systemSettingValue['file_name']][$systemSettingValue['key']] = $systemSettingValue['value'];
        }

        if ($settings) {
            config($settings);
        }
    }
}
