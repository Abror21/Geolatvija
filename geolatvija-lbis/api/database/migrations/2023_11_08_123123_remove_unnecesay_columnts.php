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
            $table->dropColumn('condition_of_access');
            $table->dropColumn('restriction_of_access');
            $table->dropColumn('priority_topic');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('geo_products', function (Blueprint $table) {
            $table->string('condition_of_access')->nullable();
            $table->string('restriction_of_access')->nullable();
            $table->string('priority_topic')->nullable();
        });
    }
};
