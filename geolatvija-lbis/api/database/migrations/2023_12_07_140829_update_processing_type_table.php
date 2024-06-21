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
        Schema::table('processing_types', function (Blueprint $table) {
            $table->unsignedBigInteger('institution_classifier_id')->nullable();
            $table->foreign('institution_classifier_id')->references('id')->on('institution_classifiers');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('processing_types', function (Blueprint $table) {
            $table->dropForeign(['institution_classifier_id']);
            $table->dropColumn('institution_classifier_id');
        });
    }
};
