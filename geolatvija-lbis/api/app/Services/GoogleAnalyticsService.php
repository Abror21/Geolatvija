<?php


namespace App\Services;

use App\Repositories\GoogleAnalyticsRepository;
use Illuminate\Database\Eloquent\Model;

/**
 * Class NotificationService
 * @package App\Services
 */
class GoogleAnalyticsService extends BaseService
{

    public function __construct
    (
        private GoogleAnalyticsRepository $googleAnalyticsRepository,
    )
    {
    }

    public function show($id)
    {
        return $this->googleAnalyticsRepository->findById($id);
    }

    public function updateGoogleAnalyticsScript($id, $data): Model
    {
        return $this->googleAnalyticsRepository->update($id, $data);
    }
}
