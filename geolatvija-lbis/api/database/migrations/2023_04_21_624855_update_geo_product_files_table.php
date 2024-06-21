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
        GeoProductFile::truncate();

        Schema::table('geo_product_files', function (Blueprint $table) {
            $table->enum('available_restriction_type', GeoProductAvailableRestrictionTypes::values())->after('service_link');
            $table->enum('license_type', GeoProductLicenceTypes::values())->after('number_classifier_value_id')->nullable();
            $table->enum('payment_type', GeoProductPaymentType::values())->after('licence_attachment_id')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('geo_product_files', function (Blueprint $table) {
            $table->dropColumn('available_restriction_type');
            $table->dropColumn('license_type');
            $table->dropColumn('payment_type');
        });
    }
};
