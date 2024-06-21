<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Enums\UserTypes;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->softDeletes();

            $table->string('name');
            $table->string('surname');
            $table->string('reg_nr')->unique()->nullable();
            $table->string('personal_code')->unique()->nullable();
            $table->string('email')->nullable();

            $table->enum('user_type', UserTypes::values());

            $table->unsignedBigInteger('status_classifier_value_id');
            $table->foreign('status_classifier_value_id')->references('id')->on('classifier_values');

            $table->unsignedBigInteger('institution_classifier_value_id')->nullable();
            $table->foreign('institution_classifier_value_id')->references('id')->on('classifier_values');

            $table->timestamp('last_login')->nullable();
            $table->timestamp('active_till')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
