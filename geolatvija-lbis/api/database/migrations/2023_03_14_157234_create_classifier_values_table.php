<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('classifier_values', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->unsignedBigInteger('classifier_id');
            $table->foreign('classifier_id')->references('id')->on('classifiers');

            $table->string('value_code');
            $table->string('translation');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('classifier_values');
    }
};
