<?php

namespace App\Console\Commands;

use App\Repositories\ClassifierValueRepository;
use App\Repositories\GeoProductOrderRepository;
use App\Services\StorageService;
use Illuminate\Console\Command;

class DeleteExpiredOrderedFiles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'geoproduct:delete-expired-ordered-files';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deletes files from order which are expired for download';

    public function __construct(
        private readonly StorageService $storageService,
        private readonly GeoProductOrderRepository $geoProductOrderRepository,
        private readonly ClassifierValueRepository $classifierValueRepository,
    )
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $orders = $this->geoProductOrderRepository->withTrashed();

        $inactiveStatus = $this->classifierValueRepository->getClassifierValueByCodes('KL19',  'INACTIVE');

        foreach ($orders as $order) {
            if (
                isset($order->geo_product_file_id) &&
                isset($order->product_file_attachment_id) &&
                isset($order->files_availability) &&
                $order->geo_product_file_id &&
                $order->product_file_attachment_id &&
                $order->files_availability->isPast())
            {
                $attachmentId = $order->product_file_attachment_id;
                $this->geoProductOrderRepository->update($order, ['product_file_attachment_id' => null, 'order_status_classifier_value_id' => $inactiveStatus->id]);
                $this->storageService->deleteFile($attachmentId);
            }
        }
    }
}
