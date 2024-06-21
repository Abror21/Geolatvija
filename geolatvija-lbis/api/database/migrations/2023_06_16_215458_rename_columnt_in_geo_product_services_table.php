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
        Schema::table('geo_product_services', function (Blueprint $table) {
            $table->renameColumn('by_belonging_classifier_value_id', 'institution_type_classifier_value_id');
        });

        Schema::table('geo_product_files', function (Blueprint $table) {
            $table->renameColumn('by_belonging_classifier_value_id', 'institution_type_classifier_value_id');
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
            $table->renameColumn('institution_type_classifier_value_id', 'by_belonging_classifier_value_id');
        });

        Schema::table('geo_product_files', function (Blueprint $table) {
            $table->renameColumn('institution_type_classifier_value_id', 'by_belonging_classifier_value_id');
        });
    }
};
