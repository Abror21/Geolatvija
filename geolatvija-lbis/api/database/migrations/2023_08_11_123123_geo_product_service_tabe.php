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
            $table->dropForeign(['by_belonging_classifier_value_id']);
            $table->dropColumn('institution_type_classifier_value_id');

            $table->dropForeign(['thematic_group_classifier_value_id']);
            $table->dropColumn('thematic_group_classifier_value_id');

            $table->unsignedBigInteger('institution_classifier_id')->nullable();
            $table->foreign('institution_classifier_id')->references('id')->on('institution_classifiers');

            $table->unsignedBigInteger('thematic_user_group_id')->nullable();
            $table->foreign('thematic_user_group_id')->references('id')->on('thematic_user_groups');
        });

        Schema::table('institution_licences', function (Blueprint $table) {
            $table->dropForeign(['service_type_classifier_value_id']);
            $table->dropColumn('service_type_classifier_value_id');

            $table->enum('licence_type', \App\Enums\LicenceTypes::values());
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
            $table->unsignedBigInteger('institution_type_classifier_value_id')->nullable();
            $table->foreign('institution_type_classifier_value_id')->references('id')->on('classifier_values');

            $table->unsignedBigInteger('thematic_group_classifier_value_id')->nullable();
            $table->foreign('thematic_group_classifier_value_id')->references('id')->on('classifier_values');

            $table->dropForeign(['institution_classifier_id']);
            $table->dropColumn('institution_classifier_id');

            $table->dropForeign(['thematic_user_group_id']);
            $table->dropColumn('thematic_user_group_id');
        });

        Schema::table('institution_licences', function (Blueprint $table) {
            $table->unsignedBigInteger('service_type_classifier_value_id')->nullable();
            $table->foreign('service_type_classifier_value_id')->references('id')->on('classifier_values');

            $table->dropColumn('licence_type');
        });
    }
};
