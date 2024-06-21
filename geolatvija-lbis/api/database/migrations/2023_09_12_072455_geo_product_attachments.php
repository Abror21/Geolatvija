<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('geo_product_attachments', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->unsignedBigInteger('attachment_id');
            $table->unsignedBigInteger('zip_id');
            $table->unsignedBigInteger('order_id');

            $table->foreign('attachment_id')->references('id')->on('attachments')->onDelete('cascade');
            $table->foreign('zip_id')->references('id')->on('attachments')->onDelete('cascade');
            $table->foreign('order_id')->references('id')->on('geo_product_orders')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('geo_product_attachments');
    }
};
