<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('licence_templates', function (Blueprint $table) {
            $table->enum('licence_type', \App\Enums\LicenceTypes::values())->default('OPEN');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('licence_templates', function (Blueprint $table) {
            $table->dropColumn('licence_type');
        });
    }
};
