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
            $table->boolean('fail_amount')->default(0);
            $table->timestamp('last_checked')->nullable();
        });

        Schema::table('geo_product_files', function (Blueprint $table) {
            $table->boolean('fail_amount')->default(0);
            $table->timestamp('last_checked')->nullable();
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
            $table->dropColumn('fail_amount');
            $table->dropColumn('last_checked');
        });

        Schema::table('geo_product_files', function (Blueprint $table) {
            $table->dropColumn('fail_amount');
            $table->dropColumn('last_checked');
        });
    }
};
