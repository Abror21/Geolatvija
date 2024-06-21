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
        Schema::table('geo_products', function (Blueprint $table) {
            $table->string('name')->nullable()->change();
            $table->string('organization_name')->nullable()->change();
            $table->string('email')->nullable()->change();
            $table->unsignedBigInteger('regularity_renewal_classifier_value_id')->nullable()->change();
            $table->string('description')->nullable()->change();
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
            $table->string('name')->change();
            $table->string('organization_name')->change();
            $table->string('email')->change();
            $table->unsignedBigInteger('regularity_renewal_classifier_value_id')->change();
            $table->text('description')->change();
        });

    }
};
