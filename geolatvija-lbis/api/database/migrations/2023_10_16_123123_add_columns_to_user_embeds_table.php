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
        Schema::table('user_embeds', function (Blueprint $table) {
            $table->json('data')->nullable();
            $table->string('pid')->nullable();
            $table->unsignedBigInteger('user_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('user_embeds', function (Blueprint $table) {
            $table->dropColumn('data');
            $table->dropColumn('pid');
        });
    }
};
