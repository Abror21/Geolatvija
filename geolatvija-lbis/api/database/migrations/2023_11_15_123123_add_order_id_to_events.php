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
        Schema::table('geo_product_events', function (Blueprint $table) {
            $table->unsignedBigInteger('geo_product_order_id')->nullable();
            $table->foreign('geo_product_order_id')->references('id')->on('geo_product_orders');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('geo_product_events', function (Blueprint $table) {
            $table->dropForeign(['geo_product_order_id']);
            $table->dropColumn('geo_product_order_id');
        });
    }
};
