<?php

use App\Enums\SystemSettingTypes;
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
            $table->unsignedBigInteger('linked_classifier_value_id')->nullable();
            $table->foreign('linked_classifier_value_id')->references('id')->on('classifier_values');

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
            $table->dropForeign(['linked_classifier_value_id']);
            $table->dropColumn('linked_classifier_value_id');
        });
    }
};
