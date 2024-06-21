<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('geo_product_services', function (Blueprint $table) {
            $table->string('dpps_uuid')->nullable();
        });

        $services = \App\Models\GeoProducts\GeoProductService::all();

        foreach ($services as $service) {
            $exploded = explode('/', $service->dpps_link);

            $uuid = end($exploded);
            $service->dpps_uuid = $uuid;
            $service->update();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('geo_product_services', function (Blueprint $table) {
            $table->dropColumn('dpps_uuid');
        });
    }
};
