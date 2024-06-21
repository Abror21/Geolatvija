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
        Schema::table('geo_product_orders', function (Blueprint $table) {
            $table->timestamp('files_availability')->nullable();
            $table->json('attachments_display_names')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('geo_product_orders', function (Blueprint $table) {
            $table->dropColumn('files_availability');
            $table->dropColumn('attachments_display_names');
        });
    }
};
