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
        Schema::table('user_notifications', function (Blueprint $table) {
            $table->string('address')->nullable();
            $table->float('coord_l_k_s_lat')->nullable();
            $table->float('coord_l_k_s_long')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_notifications', function (Blueprint $table) {
            $table->dropColumn('address');
            $table->dropColumn('coord_l_k_s_lat');
            $table->dropColumn('coord_l_k_s_long');
        });
    }
};
