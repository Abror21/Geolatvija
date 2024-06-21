<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('classifiers', function (Blueprint $table) {
            $table->softDeletes()->after('updated_at');

            $table->dropUnique('classifiers_unique_code_unique');
        });

        Schema::table('classifiers', function (Blueprint $table) {
            DB::statement('CREATE UNIQUE INDEX classifiers_unique_code_unique ON classifiers (unique_code) WHERE deleted_at IS NULL');
        });

        Schema::table('classifier_values', function (Blueprint $table) {
            $table->softDeletes()->after('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('classifiers', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });

        Schema::table('classifier_values', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });
    }
};
