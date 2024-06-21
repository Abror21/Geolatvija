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
        Schema::table('geo_product_files', function (Blueprint $table) {
            $table->dropForeign(['by_belonging_classifier_value_id']);
            $table->dropColumn('institution_type_classifier_value_id');

            $table->dropForeign(['thematic_group_classifier_value_id']);
            $table->dropColumn('thematic_group_classifier_value_id');

            $table->unsignedBigInteger('institution_classifier_id')->nullable();
            $table->foreign('institution_classifier_id')->references('id')->on('institution_classifiers');

            $table->unsignedBigInteger('thematic_user_group_id')->nullable();
            $table->foreign('thematic_user_group_id')->references('id')->on('thematic_user_groups');

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
        Schema::table('geo_product_files', function (Blueprint $table) {
            $table->unsignedBigInteger('institution_type_classifier_value_id')->nullable();
            $table->foreign('institution_type_classifier_value_id')->references('id')->on('classifier_values');

            $table->unsignedBigInteger('thematic_group_classifier_value_id')->nullable();
            $table->foreign('thematic_group_classifier_value_id')->references('id')->on('classifier_values');

            $table->dropForeign(['institution_classifier_id']);
            $table->dropColumn('institution_classifier_id');

            $table->dropForeign(['thematic_user_group_id']);
            $table->dropColumn('thematic_user_group_id');

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
