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
            $table->dropForeign(['number_classifier_value_id']);
            $table->dropColumn('number_classifier_value_id');

            $table->integer('number_value')->nullable();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('geo_product_services', function (Blueprint $table) {
            $table->unsignedBigInteger('number_classifier_value_id')->nullable();
            $table->foreign('number_classifier_value_id')->references('id')->on('classifier_values');

            $table->dropColumn('number_value');
        });


    }
};
