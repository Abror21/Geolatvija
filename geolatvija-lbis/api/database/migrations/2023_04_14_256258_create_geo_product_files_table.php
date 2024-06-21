<?php

use App\Enums\GeoProductPriceFor;
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
        Schema::create('geo_product_files', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->unsignedBigInteger('geo_product_id');
            $table->foreign('geo_product_id')->references('id')->on('geo_products');


            $table->boolean('is_public')->default(false);
            $table->text('description');

            $table->unsignedBigInteger('file_method_classifier_value_id');
            $table->foreign('file_method_classifier_value_id')->references('id')->on('classifier_values');

            $table->string('ftp_address')->nullable();
            $table->string('ftp_username')->nullable();
            $table->string('ftp_password')->nullable();

            $table->unsignedBigInteger('processing_type_classifier_value_id')->nullable();
            $table->foreign('processing_type_classifier_value_id')->references('id')->on('classifier_values');

            $table->boolean('update_is_needed')->nullable();

            $table->unsignedBigInteger('frequency_number_classifier_value_id')->nullable();
            $table->foreign('frequency_number_classifier_value_id')->references('id')->on('classifier_values');

            $table->unsignedBigInteger('frequency_type_classifier_value_id')->nullable();
            $table->foreign('frequency_type_classifier_value_id')->references('id')->on('classifier_values');

            $table->timestamp('frequency_date')->nullable();

            $table->unsignedBigInteger('by_belonging_classifier_value_id')->nullable();
            $table->foreign('by_belonging_classifier_value_id')->references('id')->on('classifier_values');

            $table->unsignedBigInteger('thematic_group_classifier_value_id')->nullable();
            $table->foreign('thematic_group_classifier_value_id')->references('id')->on('classifier_values');

            $table->unsignedBigInteger('licence_open_classifier_value_id')->nullable();
            $table->foreign('licence_open_classifier_value_id')->references('id')->on('classifier_values');

            $table->unsignedBigInteger('licence_predefined_classifier_value_id')->nullable();
            $table->foreign('licence_predefined_classifier_value_id')->references('id')->on('classifier_values');

            $table->unsignedBigInteger('licence_attachment_id')->nullable();
            $table->foreign('licence_attachment_id')->references('id')->on('attachments');

            $table->decimal('fee_cost')->nullable();
            $table->enum('price_for', GeoProductPriceFor::values())->nullable();
            $table->json('usage_request');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('geo_product_files');
    }
};
