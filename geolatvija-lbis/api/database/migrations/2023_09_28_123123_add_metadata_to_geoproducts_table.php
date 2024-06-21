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
        Schema::table('geo_products', function (Blueprint $table) {
            $table->uuid('metadata_uuid')->nullable();
            $table->string('inspire_validation')->nullable();
            $table->string('inspire_status')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('geo_products', function (Blueprint $table) {
            $table->dropColumn('metadata_uuid');
            $table->dropColumn('inspire_validation');
            $table->dropColumn('inspire_status');
        });
    }
};
