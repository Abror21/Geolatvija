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
            $table->string('precision')->nullable();
            $table->string('completeness_value')->nullable();

        });

    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('geo_products', function (Blueprint $table) {
            $table->dropColumn('precision');
            $table->dropColumn('completeness_value');
        });


    }
};
