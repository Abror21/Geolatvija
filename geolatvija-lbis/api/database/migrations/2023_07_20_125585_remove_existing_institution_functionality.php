<?php

use App\Enums\SystemSettingTypes;
use App\Enums\UserTypes;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('classifier_values', function (Blueprint $table) {
            $table->dropForeign(['linked_classifier_value_id']);
            $table->dropColumn('linked_classifier_value_id');
        });

        Schema::table('user_institutions', function (Blueprint $table) {
            $table->dropForeign(['institution_classifier_value_id']);
            $table->dropColumn('institution_classifier_value_id');

            $table->unsignedBigInteger('institution_classifier_id')->nullable();
            $table->foreign('institution_classifier_id')->references('id')->on('institution_classifiers');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('classifier_values', function (Blueprint $table) {
            $table->unsignedBigInteger('linked_classifier_value_id')->nullable();
            $table->foreign('linked_classifier_value_id')->references('id')->on('classifier_values');
        });

        Schema::table('user_institutions', function (Blueprint $table) {
            $table->dropForeign(['institution_classifier_value_id']);
            $table->dropColumn('institution_classifier_value_id');

            $table->dropForeign(['institution_classifier_id']);
            $table->dropColumn('institution_classifier_id');
        });
    }
};
