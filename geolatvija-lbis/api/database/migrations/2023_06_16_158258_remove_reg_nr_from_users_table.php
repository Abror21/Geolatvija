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
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('reg_nr');
            $table->dropColumn('user_type');

            $table->dropForeign(['institution_classifier_value_id']);
            $table->dropColumn('institution_classifier_value_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('reg_nr')->nullable();
            $table->enum('user_type', UserTypes::values())->default(UserTypes::PERSON->value);

            $table->unsignedBigInteger('institution_classifier_value_id')->nullable();
            $table->foreign('institution_classifier_value_id')->references('id')->on('classifier_values');
        });
    }
};
