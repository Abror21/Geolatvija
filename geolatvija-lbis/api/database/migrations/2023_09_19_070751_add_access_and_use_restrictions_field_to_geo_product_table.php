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
            $table->string('access_and_use_restrictions')->nullable();
            $table->integer('enable_access_and_use_restrictions')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('geo_products', function (Blueprint $table) {
            $table->dropColumn('access_and_use_restrictions');
            $table->dropColumn('enable_access_and_use_restrictions');
        });
    }
};
