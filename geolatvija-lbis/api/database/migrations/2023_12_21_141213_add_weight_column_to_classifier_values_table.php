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
        Schema::table('classifier_values', function (Blueprint $table) {
            $table->integer('weight')->nullable();
        });

        Schema::table('classifiers', function (Blueprint $table) {
            $table->boolean('enable_weights')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('classifier_values', function (Blueprint $table) {
            $table->dropColumn('weight');
        });

        Schema::table('classifiers', function (Blueprint $table) {
            $table->dropColumn('enable_weights');
        });
    }
};
