<?php

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
        Schema::create('notification_groups', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tapis_id')->unique();
            $table->string('name');
            $table->text('description');
            $table->integer('planning_level');
            $table->date('date_from');
            $table->date('date_to')->nullable();
            $table->integer('position');
            $table->timestamps();
        });

        Schema::create('user_notification_notification_group', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('notification_group_id');
            $table->unsignedBigInteger('user_notification_id');
            $table->timestamps();

            $table->foreign('notification_group_id')->references('id')->on('notification_groups');
            $table->foreign('user_notification_id')->references('id')->on('user_notifications');
        });

        Schema::table('user_notifications', function (Blueprint $table) {
            $table->boolean('sent_to_tapis')->default(false);
            $table->boolean('deleted_in_tapis')->default(false);
            $table->timestamp('deleted_in_tapis_at')->nullable();
            $table->softDeletes();
            $table->unsignedBigInteger('tapis_id')->unique()->nullable();
            $table->dropColumn('planning_level');
        });
    }

    public function down(): void
    {
        Schema::table('user_notifications', function (Blueprint $table) {
            $table->dropColumn('sent_to_tapis');
            $table->dropColumn('deleted_in_tapis');
            $table->dropColumn('deleted_in_tapis_at');
            $table->dropSoftDeletes();
            $table->dropColumn('tapis_id');
            $table->json('planning_level')->nullable();
        });

        Schema::dropIfExists('user_notification_notification_group');

        Schema::dropIfExists('notification_groups');
    }
};
