<?php

namespace Database\Seeders;


use App\Models\Dummy;
use Illuminate\Database\Seeder;

/**
 * Class ClassifierSeeder
 * @package Database\Seeders
 */
class DummySeeder extends Seeder
{
    public function __construct()
    {
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        Dummy::factory()->count(5000)->create();


    }
}
