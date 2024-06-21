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
        if (Schema::hasTable('parcel_part')) {
            DB::select('
                ALTER TABLE parcel_part
                ADD folder_name varchar(255) NULL;
            ');

            return;
        }

        Schema::dropIfExists('parcel_part');

        DB::select('
              CREATE TABLE vzd.parcel_part (
                id serial4 NOT NULL,
                geom public.geometry(multipolygon, 3059) NULL,
                code varchar(15) NULL,
                objectcode varchar(10) NULL,
                parcelcode varchar(11) NULL,
                group_code varchar(7) NULL,
                area_scale float8 NULL,
                folder_name varchar(255) NULL,
                CONSTRAINT parcel_part_pkey PRIMARY KEY (id)
            );
        ');

        DB::select('CREATE INDEX sidx_parcel_part_geom ON vzd.parcel_part USING gist (geom)');

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parcel_part');
    }
};
