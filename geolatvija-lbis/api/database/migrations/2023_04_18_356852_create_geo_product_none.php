<?php

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
        Schema::dropIfExists('geo_product_nones');

        Schema::create('geo_product_nones', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->unsignedBigInteger('geo_product_id');
            $table->foreign('geo_product_id')->references('id')->on('geo_products');

            $table->boolean('is_public');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('geo_product_nones');
    }
};
