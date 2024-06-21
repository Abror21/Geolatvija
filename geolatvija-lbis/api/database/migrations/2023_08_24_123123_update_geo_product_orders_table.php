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
        Schema::table('geo_product_orders', function (Blueprint $table) {
            $table->timestamp('confirmed_date')->nullable();

            $table->unsignedBigInteger('role_id')->nullable();
            $table->foreign('role_id')->references('id')->on('roles');
        });


    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('geo_product_orders', function (Blueprint $table) {
            $table->dropColumn('confirmed_date');

            $table->dropForeign(['role_id']);
            $table->dropColumn('role_id');
        });


    }
};
