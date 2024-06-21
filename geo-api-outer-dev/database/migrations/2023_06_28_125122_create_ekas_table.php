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
        if (Schema::hasTable('ekas')) {
            DB::select('
                ALTER TABLE ekas
                ADD folder_name varchar(255) NULL;
            ');

            return;
        }

        Schema::dropIfExists('ekas');

        DB::select('
              CREATE TABLE vzd.ekas (
                id serial4 NOT NULL,
                geom public.geometry(point, 3059) NULL,
                kods int8 NULL,
                tips_cd int4 NULL,
                statuss varchar(3) NULL,
                apstipr varchar(1) NULL,
                apst_pak int4 NULL,
                vkur_cd int8 NULL,
                vkur_tips int4 NULL,
                nosaukums varchar(128) NULL,
                sort_nos varchar(160) NULL,
                atrib varchar(32) NULL,
                pnod_cd int8 NULL,
                dat_sak varchar(19) NULL,
                dat_mod varchar(19) NULL,
                dat_beig varchar(19) NULL,
                for_build varchar(1) NULL,
                plan_adr varchar(1) NULL,
                std varchar(254) NULL,
                folder_name varchar(255) NULL,
                CONSTRAINT ekas_pkey PRIMARY KEY (id)
            );
        ');

        DB::select('CREATE INDEX sidx_ekas_geom ON vzd.ekas USING gist (geom)');

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ekas');
    }
};
