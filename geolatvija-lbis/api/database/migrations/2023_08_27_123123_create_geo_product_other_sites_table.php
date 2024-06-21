<?php

use App\Enums\UnificationType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('geo_product_other_sites', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->softDeletes();

            $table->unsignedBigInteger('geo_product_other_id');
            $table->foreign('geo_product_other_id')->references('id')->on('geo_product_others');

            $table->string('name');
            $table->string('site');

        });

        Schema::table('geo_product_others', function (Blueprint $table) {
            $table->softDeletes();
            $table->dropColumn('sites');
        });

        Schema::table('geo_product_services', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('geo_product_files', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('geo_product_other_sites');


        Schema::table('geo_product_others', function (Blueprint $table) {
            $table->json('sites')->nullable();
            $table->dropColumn('deleted_at');

        });

        Schema::table('geo_product_services', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });

        Schema::table('geo_product_files', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });

    }
};
