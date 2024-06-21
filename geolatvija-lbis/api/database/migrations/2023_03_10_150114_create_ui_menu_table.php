<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUiMenuTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ui_menus', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('translation');
            $table->string('unique_key', 100)->unique();
            $table->integer('sequence');
            $table->integer('parent_id')->constrained('ui_menus')->nullable();
            $table->text('content')->nullable();
            $table->string('description', 250)->nullable();
            $table->boolean('is_public')->default(true);
            $table->boolean('is_footer')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ui_menus');
    }
}
