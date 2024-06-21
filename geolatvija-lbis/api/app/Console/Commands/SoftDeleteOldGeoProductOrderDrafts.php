<?php

namespace App\Console\Commands;

use App\Repositories\ClassifierValueRepository;
use App\Repositories\GeoProductOrderRepository;
use Illuminate\Console\Command;

class SoftDeleteOldGeoProductOrderDrafts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'geoproduct:soft-delete-old-geo-product-order-drafts';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deletes 30 day old (since last update) Geo Product Orders which are with status DRAFT';

    public function __construct(
        private readonly GeoProductOrderRepository $geoProductOrderRepository,
        private readonly ClassifierValueRepository $classifierValueRepository,
    ) {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $classifier = $this->classifierValueRepository->findBy('value_code', 'CANCELLED');
        $draftsToDelete = $this->geoProductOrderRepository->getDraftsOlderThan30Days();

        foreach ($draftsToDelete as $draft) {
            $draft->update([
                'order_status_classifier_value_id' => $classifier->getKey(),
            ]);
            $draft->delete();
        }

        return true;
    }
}
