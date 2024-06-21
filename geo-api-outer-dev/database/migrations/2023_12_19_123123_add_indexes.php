<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::select('CREATE INDEX IF NOT EXISTS idx_parcel_part_code ON vzd.parcel_part (code)');
        DB::select('CREATE INDEX IF NOT EXISTS idx_parcel_code ON vzd.parcel (code)');
        DB::select('CREATE INDEX IF NOT EXISTS idx_building_code ON vzd.building (code)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    }
};
