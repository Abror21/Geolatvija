<?php

namespace App\Listeners;

use App\Events\CreateOrderFile;
use App\Events\GeoProductEventsBase;
use App\Repositories\AttachmentRepository;
use App\Repositories\GeoProductOrderRepository;
use App\Repositories\GeoProducts\GeoProductAttachmentsRepository;
use App\Services\GeoProductEventsService;
use App\Services\StorageService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use ZanySoft\Zip\Zip;

class CreateOrderFileListener implements ShouldQueue
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(
        private AttachmentRepository $attachmentRepository,
        private StorageService $storageService,
        private GeoProductAttachmentsRepository $geoProductAttachmentsRepository,
        private GeoProductOrderRepository $geoProductOrderRepository,
    ) {
    }


    public function handle(CreateOrderFile $data): void
    {
        Log::info('started order zip creation - ' . $data->order_id . ' ' . json_encode($data->files));

        try {
            $orderId = $data->order_id;
            $order = $this->geoProductOrderRepository->findById($orderId);

            $fileName = '/srv/www/public/' . 'order_' . $orderId . '.zip';
            $zip = new Zip();
            $zip->create($fileName);

            $productAttachments = [];

            $batchSize = 10;
            $filesCount = count($data->files);

            for ($i = 0; $i < $filesCount; $i += $batchSize) {
                $batchFiles = array_slice($data->files, $i, $batchSize);

                foreach ($batchFiles as $file) {
                    $attachment = $this->attachmentRepository->findBy('uuid', $file);

                    $productAttachments[] = [
                        'attachment_id' => $attachment->id,
                        'order_id' => $orderId
                    ];

                    //add with stream and close it, so there is no memory issues
                    $stream = $this->storageService->getFileAsStream($file);

                    if ($stream !== false) {
                        $fileContent = stream_get_contents($stream);

                        $zip->addFromString($attachment->display_name, $fileContent);

                        fclose($stream);
                    }
                }

                // Close the current zip instance to release memory
                unset($zip);

                // Create a new zip instance for the next batch
                $zip = new Zip();
                $zip->open($fileName);
            }

            $zip->close();

            $zipFile = File::get($fileName);

            $attachment = $this->storageService->storeFile($zipFile, 'orders', 'order_' . $orderId . '.zip');

            foreach ($productAttachments as $productAttachment) {
                $this->geoProductAttachmentsRepository->store(array_merge($productAttachment, ['zip_id' => $attachment->id]));
            }

            $order->product_file_attachment_id = $attachment->id;
            $order->update();

            File::delete($fileName);
        } catch (\Exception $e) {
            $order->delete();
            Log::error('failed order zip creation - ' . $data->order_id . ' ' . json_encode($data->files) . ' - ' . $e->getMessage());
        }

        Log::info('ended order zip creation - ' . $data->order_id . ' ' . json_encode($data->files));
    }
}
