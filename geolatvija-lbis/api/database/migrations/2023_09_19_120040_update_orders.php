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
        Schema::table('geo_product_orders', function (Blueprint $table) {
            $table->string('dpps_uuid')->nullable()->after('dpps_link');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('geo_product_orders', function (Blueprint $table) {
            $table->dropColumn('dpps_uuid');
        });
    }
};
