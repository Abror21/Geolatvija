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
        if (Schema::hasTable('building')) {
            DB::select('
                ALTER TABLE building
                ADD folder_name varchar(255) NULL;
            ');

            return;
        }

        DB::select('
            CREATE TABLE vzd.building (
                id serial4 NOT NULL,
                geom public.geometry(multipolygon, 3059) NULL,
                code varchar(14) NULL,
                objectcode varchar(10) NULL,
                parcelcode varchar(11) NULL,
                area_scale float8 NULL,
                group_code varchar(7) NULL,
                folder_name varchar(255) NULL,
                CONSTRAINT building_pkey PRIMARY KEY (id)
            );
        ');

        DB::select('CREATE INDEX sidx_building_geom ON vzd.building USING gist (geom)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('building');
    }
};
