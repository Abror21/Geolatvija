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
            $table->dropColumn('service_limitation_type');
        });

        Schema::table('geo_product_services', function (Blueprint $table) {
            $table->json('service_limitation_type')->nullable();
        });

        $services = \App\Models\GeoProducts\GeoProductService::all();
        foreach ($services as $service) {
            $service->service_limitation_type = ["NONE"];
            $service->update();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
    }
};
