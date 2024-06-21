<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\GeoProductOrderStatus;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('geo_product_orders', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->unsignedBigInteger('geo_product_id');
            $table->foreign('geo_product_id')->references('id')->on('geo_products');
            
            $table->unsignedBigInteger('nr');

            $table->unsignedBigInteger('order_status_classifier_value_id');
            $table->foreign('order_status_classifier_value_id')->references('id')->on('classifier_values');

            $table->timestamp('order_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('geo_product_orders');
    }
};
