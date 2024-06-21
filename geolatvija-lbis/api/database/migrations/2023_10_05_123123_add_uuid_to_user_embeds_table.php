<?php

use App\Traits\CommonHelper;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    use CommonHelper;

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('user_embeds', function (Blueprint $table) {
            $table->string('uuid')->default('replace');
        });

        $userEmbeds = \App\Models\UserEmbeds::all();

        foreach ($userEmbeds as $userEmbed) {
            $userEmbed->uuid = static::generateUUIDv4();
            $userEmbed->save();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_embeds', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });

    }
};
