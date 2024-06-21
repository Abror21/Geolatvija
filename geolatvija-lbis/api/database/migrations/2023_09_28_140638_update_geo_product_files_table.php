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
        Schema::table('geo_product_files', function(Blueprint $table) {
            $table->dropColumn('institution_classifier_id');
            $table->unsignedBigInteger('institution_type_classifier_id')->nullable();
            $table->foreign('institution_type_classifier_id')->references('id')->on('classifier_values');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('geo_product_files', function (Blueprint $table) {
            $table->unsignedBigInteger('institution_classifier_id')->nullable();
            $table->dropForeign(['institution_type_classifier_id']);
            $table->dropColumn('institution_type_classifier_id');
        });
    }
};
