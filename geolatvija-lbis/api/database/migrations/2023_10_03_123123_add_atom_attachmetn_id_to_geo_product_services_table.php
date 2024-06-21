<?php

use App\Traits\CommonHelper;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    use CommonHelper;

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('geo_product_services', function (Blueprint $table) {
            $table->unsignedBigInteger('atom_attachment_id')->nullable();
            $table->foreign('atom_attachment_id')->references('id')->on('attachments');
        });

        Schema::table('attachments', function (Blueprint $table) {
            $table->string('uuid')->default('replace');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('geo_product_services', function (Blueprint $table) {
            $table->dropForeign(['atom_attachment_id']);
            $table->dropColumn('atom_attachment_id');
        });
    }
};
