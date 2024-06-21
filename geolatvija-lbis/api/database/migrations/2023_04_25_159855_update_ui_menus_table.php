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
        Schema::table('ui_menus', function (Blueprint $table) {
            $table->string('url')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ui_menus', function (Blueprint $table) {
            $table->dropColumn('url');
        });
    }
};
