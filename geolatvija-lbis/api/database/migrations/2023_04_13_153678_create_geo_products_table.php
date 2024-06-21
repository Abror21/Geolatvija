<?php

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
        Schema::create('geo_products', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->enum('status', GeoProductStatus::values());
            $table->string('name');
            $table->text('description');
            $table->boolean('is_public')->default(false);

            $table->timestamp('public_from')->nullable();
            $table->timestamp('public_to')->nullable();

            $table->unsignedBigInteger('regularity_renewal_classifier_value_id');
            $table->foreign('regularity_renewal_classifier_value_id')->references('id')->on('classifier_values');

            $table->unsignedBigInteger('photo_attachment_id');
            $table->foreign('photo_attachment_id')->references('id')->on('attachments');

            $table->unsignedBigInteger('specification_attachment_id');
            $table->foreign('specification_attachment_id')->references('id')->on('attachments');

            $table->string('organization_name');
            $table->string('email');

            $table->unsignedBigInteger('coordinates_classifier_value_id')->nullable();
            $table->foreign('coordinates_classifier_value_id')->references('id')->on('classifier_values');

            $table->unsignedBigInteger('scale_classifier_value_id')->nullable();
            $table->foreign('scale_classifier_value_id')->references('id')->on('classifier_values');

            $table->timestamp('data_release_date')->nullable();
            $table->timestamp('data_updated_at')->nullable();
            $table->boolean('is_inspired')->default(false)->nullable();

            $table->unsignedBigInteger('spatial_classifier_value_id')->nullable();
            $table->foreign('spatial_classifier_value_id')->references('id')->on('classifier_values');

            $table->string('data_origin')->nullable();
            $table->string('condition_of_access')->nullable();
            $table->string('restriction_of_access')->nullable();
            $table->string('priority_topic')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('geo_products');
    }
};
