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
        Schema::table('geo_products', function (Blueprint $table) {
            $table->softDeletes();

            $table->unsignedBigInteger('owner_institution_classifier_id')->nullable();
            $table->foreign('owner_institution_classifier_id')->references('id')->on('institution_classifiers');



            DB::statement("ALTER TABLE geo_products DROP CONSTRAINT geo_products_status_check");
            $types = GeoProductStatus::values();
            $result = join( ', ', array_map(function ($value){
                return sprintf("'%s'::character varying", $value);
            }, $types));

            DB::statement("ALTER TABLE geo_products ADD CONSTRAINT geo_products_status_check CHECK (status::text = ANY (ARRAY[$result]::text[]))");
        });


    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('geo_products', function (Blueprint $table) {
            $table->dropColumn('deleted_at');

            $table->dropForeign(['owner_institution_classifier_id']);
            $table->dropColumn('owner_institution_classifier_id');
        });


    }
};
