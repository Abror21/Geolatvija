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
        if (Schema::hasTable('autoceli_ielas')) {
            DB::select('
                ALTER TABLE autoceli_ielas
                ADD folder_name varchar(255) NULL;
            ');

            return;
        }

        Schema::dropIfExists('autoceli_ielas');

        DB::select('
            CREATE TABLE vzd.autoceli_ielas (
                id serial4 NOT NULL,
                geom public.geometry(multilinestring, 3059) NULL,
                kods int8 NULL,
                tips_cd int4 NULL,
                nosaukums varchar(128) NULL,
                vkur_cd int8 NULL,
                vkur_tips int4 NULL,
                apstipr varchar(1) NULL,
                apst_pak int4 NULL,
                statuss varchar(3) NULL,
                sort_nos varchar(160) NULL,
                dat_sak varchar(19) NULL,
                dat_mod varchar(19) NULL,
                dat_beig varchar(19) NULL,
                atrib varchar(32) NULL,
                std varchar(254) NULL,
                layer varchar NULL,
                folder_name varchar(255) NULL,
                CONSTRAINT autoceli_ielas_pkey PRIMARY KEY (id)
            );
        ');

        DB::select('CREATE INDEX sidx_autoceli_ielas_geom ON vzd.autoceli_ielas USING gist (geom)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('autoceli_ielas');
    }
};
