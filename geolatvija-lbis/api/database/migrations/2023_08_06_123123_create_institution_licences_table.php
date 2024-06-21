<?php

use App\Enums\UnificationType;
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
        Schema::create('institution_licences', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->string('name');
            $table->unsignedBigInteger('institution_classifier_id');
            $table->foreign('institution_classifier_id')->references('id')->on('institution_classifiers');
            $table->unsignedBigInteger('service_type_classifier_value_id');
            $table->foreign('service_type_classifier_value_id')->references('id')->on('classifier_values');
            $table->unsignedBigInteger('attachment_id')->nullable();
            $table->foreign('attachment_id')->references('id')->on('attachments');

            $table->string('site')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_public')->default(false);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('institution_licences');
    }
};
