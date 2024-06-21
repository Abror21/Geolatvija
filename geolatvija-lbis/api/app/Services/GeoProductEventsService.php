<?php

namespace App\Services;

use App\Events\GeoProductEventsBase;
use App\Repositories\GeoProducts\GeoProductEventsRepository;
use App\Repositories\GeoProducts\GeoProductFileRepository;
use App\Repositories\GeoProducts\GeoProductFilesFtpRepository;

/**
 * Class GeoProductOrderService
 * @package App\Services
 */
class GeoProductEventsService extends BaseService
{
    public function __construct(
        protected GeoProductEventsRepository $geoProductEventsRepository,
        protected GeoProductFileRepository $geoProductFileRepository
    )
    {
    }

    /**
     * logEvent
     *
     * @param mixed $event
     */
    public function logEvent(GeoProductEventsBase $event)
    {
        $subjectId = null;
        if (!$event->event_subject_id && $event->event_object_id && $event->event_type === 'DOWNLOAD') {
            $file = $this->geoProductFileRepository->findById($event->event_object_id);

            $subjectId = $file->geo_product_id;
        }

        $this->geoProductEventsRepository->store([
            'event_type' => $event->event_type,
            'event_subject_id' => $subjectId ?: $event->event_subject_id,
            'event_subject_type' => $event->event_subject_type,
            'event_object_id' => $event->event_object_id,
            'event_object_type' => $event->event_object_type,
            'event_initiator_id' => $event->event_initiator_id,
            'event_data_old' => json_encode($event->event_data_old),
            'event_data_new' => json_encode($event->event_data_new),
            'event_note' => $event->event_note,
            'geo_product_order_id' => $event->geo_product_order_id,
        ]);
    }
}
