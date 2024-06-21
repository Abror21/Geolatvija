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
        Schema::create('institution_classifiers', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->string('reg_nr');
            $table->string('name');
            $table->unsignedBigInteger('institution_type_classifier_value_id');
            $table->foreign('institution_type_classifier_value_id')->references('id')->on('classifier_values');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('institution_classifiers');
    }
};
