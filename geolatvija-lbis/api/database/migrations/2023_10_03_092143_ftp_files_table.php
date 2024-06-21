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
        Schema::table('geo_product_files', function (Blueprint $table) {
            $table->string('ftp_cron')->nullable();
        });

        Schema::create('geo_product_files_ftp', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->unsignedBigInteger('attachment_id');
            $table->unsignedBigInteger('zip_id')->nullable();
            $table->unsignedBigInteger('files_id');

            $table->foreign('attachment_id')->references('id')->on('attachments')->onDelete('cascade');
            $table->foreign('zip_id')->references('id')->on('attachments')->onDelete('cascade');
            $table->foreign('files_id')->references('id')->on('geo_product_files')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('geo_product_files', function (Blueprint $table) {
            $table->dropColumn('ftp_cron');
        });
        Schema::dropIfExists('geo_product_files_ftp');
    }
};
