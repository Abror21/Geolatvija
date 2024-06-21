<?php

use App\Enums\GeoProductServiceLimitationTypes;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\GeoProductStatus;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('geo_product_services', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->unsignedBigInteger('geo_product_id');
            $table->foreign('geo_product_id')->references('id')->on('geo_products');

            $table->text('description');
            $table->boolean('is_public');

            $table->unsignedBigInteger('service_type_classifier_value_id');
            $table->foreign('service_type_classifier_value_id')->references('id')->on('classifier_values');

            $table->string('service_link');

            $table->unsignedBigInteger('by_belonging_classifier_value_id')->nullable();
            $table->foreign('by_belonging_classifier_value_id')->references('id')->on('classifier_values');

            $table->unsignedBigInteger('thematic_group_classifier_value_id')->nullable();
            $table->foreign('thematic_group_classifier_value_id')->references('id')->on('classifier_values');

            $table->enum('service_limitation', GeoProductServiceLimitationTypes::values());

            $table->unsignedBigInteger('period_classifier_value_id')->nullable();
            $table->foreign('period_classifier_value_id')->references('id')->on('classifier_values');

            $table->unsignedBigInteger('number_classifier_value_id')->nullable();
            $table->foreign('number_classifier_value_id')->references('id')->on('classifier_values');

            $table->unsignedBigInteger('licence_open_classifier_value_id')->nullable();
            $table->foreign('licence_open_classifier_value_id')->references('id')->on('classifier_values');

            $table->unsignedBigInteger('licence_predefined_classifier_value_id')->nullable();
            $table->foreign('licence_predefined_classifier_value_id')->references('id')->on('classifier_values');

            $table->unsignedBigInteger('licence_attachment_id')->nullable();
            $table->foreign('licence_attachment_id')->references('id')->on('attachments');

            $table->decimal('fee_cost')->nullable();
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
        Schema::dropIfExists('geo_product_services');
    }
};
