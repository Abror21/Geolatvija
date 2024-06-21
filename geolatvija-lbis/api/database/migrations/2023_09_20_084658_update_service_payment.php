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
        DB::statement("ALTER TABLE geo_product_services DROP CONSTRAINT geo_product_services_payment_type_check");
        // (((payment_type)::text = ANY ((ARRAY['FREE'::character varying, 'FEE'::character varying])::text[])))
        DB::statement("ALTER TABLE geo_product_services ADD CONSTRAINT geo_product_services_payment_type_check CHECK (((payment_type)::text = ANY ((ARRAY['FREE'::character varying, 'FEE'::character varying, 'PREPAY'::character varying])::text[])))");

        Schema::table('geo_product_services', function (Blueprint $table) {
            $table->string('service_step')->nullable()->after('payment_type');
            $table->string('position')->nullable()->after('service_step');
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('geo_product_services', function (Blueprint $table) {
            $table->dropColumn('service_step');
            $table->dropColumn('position');
        });
    }
};
