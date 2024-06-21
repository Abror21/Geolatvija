<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('geo_product_orders', function (Blueprint $table) {
            $table->dropColumn('month');

            $table->integer('period_number_value')->nullable();

            // Changes expire_at column from Date to timestamp
            DB::statement('ALTER TABLE geo_product_orders ALTER COLUMN expire_at TYPE TIMESTAMP USING expire_at::timestamp');

            $table->unsignedBigInteger('period_classifier_value_id')->nullable();
            $table->foreign('period_classifier_value_id')->references('id')->on('classifier_values');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('geo_product_orders', function (Blueprint $table) {
            $table->integer('month')->nullable();

            $table->dropColumn('period_number_value');

            // Changes back expire_at column to Date from timestamp
            DB::statement('ALTER TABLE geo_product_orders ALTER COLUMN expire_at TYPE DATE');
            $table->date('expire_at')->nullable()->change();

            $table->dropForeign(['period_classifier_value_id']);
            $table->dropColumn('period_classifier_value_id');
        });
    }
};
