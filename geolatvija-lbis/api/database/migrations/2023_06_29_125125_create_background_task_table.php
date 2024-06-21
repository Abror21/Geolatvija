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


        Schema::create('background_tasks', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->string('name');
            $table->string('command');
            $table->text('description')->nullable();
            $table->string('cron');
            $table->timestamp('executed_at')->nullable();
            $table->integer('execution_time')->nullable();
            $table->boolean('is_active');
            $table->integer('failed' )->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('background_tasks');
    }
};
