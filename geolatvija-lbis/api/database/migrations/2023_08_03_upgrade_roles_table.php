<?php

use App\Enums\SystemSettingTypes;
use App\Enums\UserTypes;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
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
        Schema::dropIfExists('user_institutions');

        Schema::table('roles', function (Blueprint $table) {
            $table->softDeletes();

            $table->unsignedBigInteger('created_by_role_id')->nullable();
            $table->foreign('created_by_role_id')->references('id')->on('roles');

            $table->unsignedBigInteger('institution_classifier_id')->nullable();
            $table->foreign('institution_classifier_id')->references('id')->on('institution_classifiers');

            $table->boolean('is_active')->default(false);
            $table->timestamp('active_till')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_institutions', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');

            $table->unsignedBigInteger('institution_classifier_id')->nullable();
            $table->foreign('institution_classifier_id')->references('id')->on('institution_classifiers');
        });


        Schema::table('roles', function (Blueprint $table) {
            $table->dropColumn('deleted_at');

            $table->dropForeign(['created_by_role_id']);
            $table->dropColumn('created_by_role_id');

            $table->dropForeign(['institution_classifier_id']);
            $table->dropColumn('institution_classifier_id');

            $table->dropColumn('is_active');
            $table->dropColumn('active_till');
        });
    }
};
