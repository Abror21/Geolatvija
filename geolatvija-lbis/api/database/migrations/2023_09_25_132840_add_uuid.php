<?php

use App\Models\GeoProductOrder;
use App\Models\GeoProducts\GeoProductFile;
use App\Models\GeoProducts\GeoProductService;
use App\Traits\CommonHelper;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    use CommonHelper;
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('geo_product_files', function (Blueprint $table) {
            $table->string('uuid')->default('replace');
        });
        Schema::table('geo_product_services', function (Blueprint $table) {
            $table->string('uuid')->default('replace');
        });
        Schema::table('geo_product_orders', function (Blueprint $table) {
            $table->string('uuid')->default('replace');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('geo_product_files', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });
        Schema::table('geo_product_services', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });
        Schema::table('geo_product_orders', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });
    }
};
