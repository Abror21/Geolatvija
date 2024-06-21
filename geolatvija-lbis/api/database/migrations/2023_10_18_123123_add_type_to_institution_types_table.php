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
        Schema::table('institution_licences', function (Blueprint $table) {
            $table->enum('type', ['LICENCE', 'TEMPLATE'])->default('LICENCE');
            $table->unsignedBigInteger('institution_classifier_id')->nullable()->change();

        });

        Schema::dropIfExists('licence_templates');
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('institution_licences', function (Blueprint $table) {
            $table->dropColumn('type');
        });

        Schema::create('licence_templates', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name');
            $table->unsignedBigInteger('attachment_id')->nullable();
            $table->foreign('attachment_id')->references('id')->on('attachments');

            $table->string('site')->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_public')->default(false);
        });
    }
};
