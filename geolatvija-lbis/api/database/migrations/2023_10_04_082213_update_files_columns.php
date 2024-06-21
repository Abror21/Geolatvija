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
            $table->dropForeign('geo_product_files_processing_type_classifier_value_id_foreign');
            $table->dropColumn('processing_type_classifier_value_id');
        });

        Schema::table('geo_product_files', function (Blueprint $table) {
            $table->unsignedBigInteger('processing_type_classifier_value_id')->nullable();
            $table->foreign('processing_type_classifier_value_id')->references('id')->on('processing_types');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
