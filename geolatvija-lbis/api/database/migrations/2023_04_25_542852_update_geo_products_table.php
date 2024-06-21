<?php

use App\Enums\GeoProductAvailableRestrictionTypes;
use App\Enums\GeoProductLicenceTypes;
use App\Enums\GeoProductPaymentType;
use App\Enums\GeoProductServiceLimitationTypes;
use App\Models\GeoProducts\GeoProductFile;
use App\Models\GeoProducts\GeoProductService;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('geo_products', function (Blueprint $table) {
            $table->unsignedBigInteger('photo_attachment_id')->nullable()->change();
            $table->unsignedBigInteger('specification_attachment_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
    }
};
