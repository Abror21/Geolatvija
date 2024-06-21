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
        Schema::create('rights', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->boolean('is_allowed');

            $table->unsignedBigInteger('user_group_id');
            $table->foreign('user_group_id')->references('id')->on('user_groups');

            $table->unsignedBigInteger('ui_menu_id');
            $table->foreign('ui_menu_id')->references('id')->on('ui_menus');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rights');
    }
};
