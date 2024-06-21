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
        Schema::table('geo_product_others', function (Blueprint $table) {
            $table->uuid('metadata_uuid')->nullable();
        });

        Schema::table('geo_product_files', function (Blueprint $table) {
            $table->uuid('metadata_uuid')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('geo_product_others', function (Blueprint $table) {
            $table->dropColumn('metadata_uuid');
        });

        Schema::table('geo_product_files', function (Blueprint $table) {
            $table->dropColumn('metadata_uuid');
        });
    }
};
