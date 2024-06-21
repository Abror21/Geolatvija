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
            $table->unsignedBigInteger('file_format_classifier_value_id')->nullable();
            $table->foreign('file_format_classifier_value_id')->references('id')->on('classifier_values');

            $table->string('file_format_version')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('geo_product_files', function (Blueprint $table) {
            $table->dropForeign(['file_format_classifier_value_id']);
            $table->dropColumn('file_format_classifier_value_id');

            $table->dropColumn('file_format_version');
        });
    }
};
