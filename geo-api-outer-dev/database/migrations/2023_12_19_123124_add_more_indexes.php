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
        DB::select('CREATE INDEX IF NOT EXISTS idx_parcel_part_folder_name ON vzd.parcel_part (folder_name)');
        DB::select('CREATE INDEX IF NOT EXISTS idx_parcel_folder_name ON vzd.parcel (folder_name)');
        DB::select('CREATE INDEX IF NOT EXISTS idx_building_folder_name ON vzd.building (folder_name)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    }
};
