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
        Schema::table('geo_products', function (Blueprint $table) {
            $table->unsignedBigInteger('primary_data_theme_classifier_value_id')->nullable();
            $table->foreign('primary_data_theme_classifier_value_id')->references('id')->on('classifier_values');
            $table->integer('enable_primary_data_theme_classifier')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('geo_products', function (Blueprint $table) {
            $table->dropForeign(['primary_data_theme_classifier_value_id']);
            $table->dropColumn('primary_data_theme_classifier_value_id');
            $table->dropColumn('enable_primary_data_theme_classifier');
        });
    }
};
