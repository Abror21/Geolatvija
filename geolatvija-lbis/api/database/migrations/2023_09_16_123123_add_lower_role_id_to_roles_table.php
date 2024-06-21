<?php

use App\Enums\GeoProductStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {


        Schema::table('roles', function (Blueprint $table) {
            $table->unsignedBigInteger('lower_created_by_role_id')->nullable();
            $table->foreign('lower_created_by_role_id')->references('id')->on('roles');
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->dropForeign(['lower_created_by_role_id']);
            $table->dropColumn('lower_created_by_role_id');
        });
    }
};
