<?php

use App\Enums\GeoProductAvailableRestrictionTypes;
use App\Enums\GeoProductLicenceTypes;
use App\Enums\GeoProductPaymentType;
use App\Enums\GeoProductServiceLimitationTypes;
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
        GeoProductService::truncate();

        Schema::table('geo_product_services', function (Blueprint $table) {
            $table->enum('available_restriction_type', GeoProductAvailableRestrictionTypes::values())->after('service_link');
            $table->enum('service_limitation_type', GeoProductServiceLimitationTypes::values())->after('thematic_group_classifier_value_id');
            $table->enum('license_type', GeoProductLicenceTypes::values())->after('number_classifier_value_id')->nullable();
            $table->enum('payment_type', GeoProductPaymentType::values())->after('licence_attachment_id')->nullable();

            $table->dropColumn('service_limitation');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('geo_product_services', function (Blueprint $table) {
            $table->dropColumn('available_restriction_type');
            $table->dropColumn('service_limitation_type');
            $table->dropColumn('license_type');
            $table->dropColumn('payment_type');

            $table->enum('service_limitation', GeoProductServiceLimitationTypes::values())->nullable();
        });
    }
};
