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
        if (Schema::hasColumn('geo_products', 'primary_data_classifier_value_id')) {
            Schema::table('geo_products', function (Blueprint $table) {
                $table->dropColumn('primary_data_classifier_value_id');
        });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('geo_products', function (Blueprint $table) {
            $table->unsignedBigInteger('primary_data_classifier_value_id')->nullable();
            $table->foreign('primary_data_classifier_value_id')->references('id')->on('classifier_values');
        });
    }
};
