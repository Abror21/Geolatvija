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
        Schema::create('geo_product_events', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('event_type');

            $table->unsignedBigInteger('event_subject_id')->nullable();
            $table->string('event_subject_type')->nullable();

            $table->unsignedBigInteger('event_object_id')->nullable();
            $table->string('event_object_type')->nullable();

            $table->unsignedBigInteger('event_initiator_id')->nullable();

            $table->text('event_data_old')->nullable();
            $table->text('event_data_new')->nullable();
            $table->text('event_note')->nullable();

            $table->index(['event_type']);

            $table->index(['event_subject_id']);
            $table->index(['event_subject_type']);

            $table->index(['event_object_id']);
            $table->index(['event_object_type']);

            $table->index(['event_initiator_id']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('geo_product_events');
    }
};
