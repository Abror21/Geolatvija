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
        Schema::table('geo_product_files', function (Blueprint $table) {
            $table->integer('file_method_classifier_value_id')->nullable()->change();
        });

        DB::statement('ALTER TABLE geo_product_files ALTER COLUMN available_restriction_type DROP NOT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('geo_product_files', function (Blueprint $table) {});
    }
};
