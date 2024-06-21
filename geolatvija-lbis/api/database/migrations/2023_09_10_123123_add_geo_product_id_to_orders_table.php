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
            $table->unsignedBigInteger('geo_product_id')->nullable();
            $table->foreign('geo_product_id')->references('id')->on('geo_products');
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
            $table->dropForeign(['geo_product_id']);
            $table->dropColumn('geo_product_id');
        });
    }
};
