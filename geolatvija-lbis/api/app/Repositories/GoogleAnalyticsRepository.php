<?php

namespace App\Repositories;

use App\Models\GoogleAnalytics;
use Illuminate\Database\Eloquent\Model;

/**
 * Class NotificationRepository
 * @package App\Repositories
 */
class GoogleAnalyticsRepository extends BaseRepository
{

    /**
     * NotificationRepository constructor.
     * @param GoogleAnalytics $googleAnalytics
     */
    public function __construct(GoogleAnalytics $googleAnalytics)
    {
        parent::__construct($googleAnalytics);
    }

    /**
     * @return Model
     */
    public function create(): Model
    {
        return new googleAnalytics();
    }

    public function getGoogleAnalyticsScript()
    {
        return GoogleAnalytics::select('user_notifications.*');
    }

}
