<?php

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
        Schema::table('geo_product_services', function (Blueprint $table) {
            $table->dropForeign(['licence_open_classifier_value_id']);
            $table->dropColumn('licence_open_classifier_value_id');

            $table->dropForeign(['licence_predefined_classifier_value_id']);
            $table->dropColumn('licence_predefined_classifier_value_id');

            $table->unsignedBigInteger('institution_licence_id')->nullable();
            $table->foreign('institution_licence_id')->references('id')->on('institution_licences');

            $table->boolean('need_target')->default(false);
        });


    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('geo_product_services', function (Blueprint $table) {
            $table->unsignedBigInteger('licence_open_classifier_value_id')->nullable();
            $table->foreign('licence_open_classifier_value_id')->references('id')->on('classifier_values');

            $table->unsignedBigInteger('licence_predefined_classifier_value_id')->nullable();
            $table->foreign('licence_predefined_classifier_value_id')->references('id')->on('classifier_values');

            $table->dropForeign(['institution_licence_id']);
            $table->dropColumn('institution_licence_id');
            $table->dropColumn('need_target');
        });

    }
};
