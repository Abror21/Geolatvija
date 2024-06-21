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
        Schema::table('parcel', function (Blueprint $table) {
            $table->string('address')->nullable();
            $table->string('purpose_use')->nullable();
            $table->integer('area')->nullable();
            $table->string('landbook_folio_nr')->nullable();
            $table->string('owner')->nullable();
            $table->boolean('owned_by_municipality')->default(false);
            $table->boolean('public_water')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('parcel', function (Blueprint $table) {
            $table->dropColumn('address');
            $table->dropColumn('purpose_use');
            $table->dropColumn('area');
            $table->dropColumn('landbook_folio_nr');
            $table->dropColumn('owner');
            $table->dropColumn('owned_by_municipality');
            $table->dropColumn('public_water');
        });
    }
};
