<?php

use App\Enums\UnificationType;
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
        Schema::create('thematic_user_group_relations', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users');

            $table->unsignedBigInteger('thematic_user_group_id');
            $table->foreign('thematic_user_group_id')->references('id')->on('thematic_user_groups');

            $table->unsignedBigInteger('institution_classifier_id');
            $table->foreign('institution_classifier_id')->references('id')->on('institution_classifiers');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('thematic_user_group_relations');
    }
};
