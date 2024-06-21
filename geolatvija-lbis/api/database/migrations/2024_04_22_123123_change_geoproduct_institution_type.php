<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('geo_product_services', function (Blueprint $table) {
            $table->json('institution_type_classifier_ids')->nullable();
        });

        $services = \App\Models\GeoProducts\GeoProductService::all();

        foreach ($services as $service) {
            if ($service->institution_type_classifier_id) {
                $service->institution_type_classifier_ids = [$service->institution_type_classifier_id];
                $service->update();
            }
        }

        Schema::table('geo_product_services', function (Blueprint $table) {
            $table->dropForeign(['institution_type_classifier_id']);
            $table->dropColumn('institution_type_classifier_id');
        });


        Schema::table('geo_product_files', function (Blueprint $table) {
            $table->json('institution_type_classifier_ids')->nullable();
        });

        $files = \App\Models\GeoProducts\GeoProductFile::all();

        foreach ($files as $file) {
            if ($file->institution_type_classifier_id) {
                $file->institution_type_classifier_ids = [$file->institution_type_classifier_id];
                $file->update();
            }
        }

        Schema::table('geo_product_files', function (Blueprint $table) {
            $table->dropForeign(['institution_type_classifier_id']);
            $table->dropColumn('institution_type_classifier_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('geo_product_services', function (Blueprint $table) {
            $table->unsignedBigInteger('institution_type_classifier_id')->nullable();
            $table->foreign('institution_type_classifier_id')->references('id')->on('classifier_values');

            $table->dropColumn('institution_type_classifier_ids');
        });

        Schema::table('geo_product_files', function (Blueprint $table) {
            $table->unsignedBigInteger('institution_type_classifier_id')->nullable();
            $table->foreign('institution_type_classifier_id')->references('id')->on('classifier_values');

            $table->dropColumn('institution_type_classifier_ids');
        });
    }
};
