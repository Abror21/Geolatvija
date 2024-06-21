<?php

use App\Enums\GeoProductStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('geo_products', function (Blueprint $table) {
            $table->dropForeign(['coordinates_classifier_value_id']);
            $table->dropColumn('coordinates_classifier_value_id');

            $table->dropForeign(['spatial_classifier_value_id']);
            $table->dropColumn('spatial_classifier_value_id');


            $table->unsignedBigInteger('coordinate_system_classifier_value_id')->nullable();
            $table->foreign('coordinate_system_classifier_value_id')->references('id')->on('classifier_values');

            $table->unsignedBigInteger('spatial_data_classifier_value_id')->nullable();
            $table->foreign('spatial_data_classifier_value_id')->references('id')->on('classifier_values');

            $table->unsignedBigInteger('inspired_data_classifier_value_id')->nullable();
            $table->foreign('inspired_data_classifier_value_id')->references('id')->on('classifier_values');

            $table->unsignedBigInteger('keyword_classifier_value_id')->nullable();
            $table->foreign('keyword_classifier_value_id')->references('id')->on('classifier_values');

            $table->unsignedBigInteger('primary_data_classifier_value_id')->nullable();
            $table->foreign('primary_data_classifier_value_id')->references('id')->on('classifier_values');

        });


    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('geo_products', function (Blueprint $table) {
            $table->unsignedBigInteger('coordinates_classifier_value_id')->nullable();
            $table->foreign('coordinates_classifier_value_id')->references('id')->on('classifier_values');

            $table->unsignedBigInteger('spatial_classifier_value_id')->nullable();
            $table->foreign('spatial_classifier_value_id')->references('id')->on('classifier_values');


            $table->dropForeign(['coordinate_system_classifier_value_id']);
            $table->dropColumn('coordinate_system_classifier_value_id');


            $table->dropForeign(['spatial_data_classifier_value_id']);
            $table->dropColumn('spatial_data_classifier_value_id');

            $table->dropForeign(['inspired_data_classifier_value_id']);
            $table->dropColumn('inspired_data_classifier_value_id');

            $table->dropForeign(['keyword_classifier_value_id']);
            $table->dropColumn('keyword_classifier_value_id');

            $table->dropForeign(['primary_data_classifier_value_id']);
            $table->dropColumn('primary_data_classifier_value_id');

        });


    }
};
