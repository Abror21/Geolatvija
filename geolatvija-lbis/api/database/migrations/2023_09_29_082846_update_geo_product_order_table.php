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
            $table->dropColumn('target');
            $table->unsignedBigInteger('target_classifier_value_id')->nullable();
            $table->foreign('target_classifier_value_id')->references('id')->on('classifier_values');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('geo_product_orders', function (Blueprint $table) {
            $table->string('target')->nullable();
            $table->dropForeign(['target_classifier_value_id']);
            $table->dropColumn('target_classifier_value_id');
        });
    }
};
