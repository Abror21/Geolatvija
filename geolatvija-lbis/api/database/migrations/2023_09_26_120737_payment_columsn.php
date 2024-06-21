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
            $table->string('payment_request_id')->nullable();
            $table->string('payment_request_url')->nullable();
            $table->longText('payment_status')->nullable();
            $table->longText('payment_request_status')->nullable();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('geo_product_orders', function (Blueprint $table) {
            $table->dropColumn('payment_request_id');
            $table->dropColumn('payment_request_url');
            $table->dropColumn('payment_status');
            $table->dropColumn('payment_request_status');
        });
    }
};
