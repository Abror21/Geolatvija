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
            $table->dropForeign(['geo_product_id']);
            $table->dropColumn('geo_product_id');
            $table->dropColumn('nr');
            $table->dropColumn('order_date');

            $table->unsignedBigInteger('geo_product_service_id')->nullable();
            $table->foreign('geo_product_service_id')->references('id')->on('geo_product_services');

            $table->unsignedBigInteger('geo_product_file_id')->nullable();
            $table->foreign('geo_product_file_id')->references('id')->on('geo_product_files');

            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->boolean('confirmed_rules')->default(false);
            $table->string('ip_limitation')->nullable();
            $table->integer('month')->nullable();
            $table->float('payment_amount')->nullable();
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
            $table->unsignedBigInteger('geo_product_id')->nullable();
            $table->foreign('geo_product_id')->references('id')->on('geo_products');
            $table->integer('nr');
            $table->timestamp('order_date');

            $table->dropForeign(['geo_product_service_id']);
            $table->dropColumn('geo_product_service_id');

            $table->dropForeign(['geo_product_file_id']);
            $table->dropColumn('geo_product_file_id');

            $table->dropColumn('email');
            $table->dropColumn('phone');
            $table->dropColumn('confirmed_rules');
            $table->dropColumn('ip_limitation');
            $table->dropColumn('month');
            $table->dropColumn('payment_amount');
        });


    }
};
