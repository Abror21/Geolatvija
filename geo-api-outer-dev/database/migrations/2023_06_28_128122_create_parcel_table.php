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
        if (Schema::hasTable('parcel')) {
            DB::select('
                ALTER TABLE parcel
                ADD folder_name varchar(255) NULL;
            ');

            return;
        }

        Schema::dropIfExists('parcel');

        DB::select('
              CREATE TABLE vzd.parcel (
                id serial4 NOT NULL,
                geom public.geometry(multipolygon, 3059) NULL,
                code varchar(11) NULL,
                geom_act_d date NULL,
                objectcode varchar(10) NULL,
                area_scale float8 NULL,
                group_code varchar(7) NULL,
                folder_name varchar(255) NULL,
                CONSTRAINT parcel_pkey PRIMARY KEY (id)
            );
        ');

        DB::select('CREATE INDEX sidx_parcel_geom ON vzd.parcel USING gist (geom)');

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parcel');
    }
};
