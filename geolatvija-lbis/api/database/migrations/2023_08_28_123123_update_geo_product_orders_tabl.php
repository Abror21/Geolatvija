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
            $table->unsignedBigInteger('geo_product_other_id')->nullable();
            $table->foreign('geo_product_other_id')->references('id')->on('geo_product_others');

            $table->unsignedBigInteger('accepted_licence_attachment_id')->nullable();
            $table->foreign('accepted_licence_attachment_id')->references('id')->on('attachments');

            $table->string('target')->nullable();
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
            $table->dropForeign(['geo_product_other_id']);
            $table->dropColumn('geo_product_other_id');

            $table->dropForeign(['accepted_licence_attachment_id']);
            $table->dropColumn('accepted_licence_attachment_id');

            $table->dropColumn('target');
        });


    }
};
