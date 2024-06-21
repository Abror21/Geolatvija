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
        Schema::table('building', function (Blueprint $table) {
            $table->string('address')->nullable();
            $table->boolean('public_water')->default(false);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('building', function (Blueprint $table) {
            $table->dropColumn('address');
            $table->dropColumn('public_water');
        });
    }
};
