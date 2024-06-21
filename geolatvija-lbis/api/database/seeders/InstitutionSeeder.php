<?php

namespace Database\Seeders;

use App\Repositories\ClassifierRepository;
use App\Repositories\InstitutionClassifierRepository;
use App\Repositories\ClassifierValueRepository;
use Illuminate\Database\Seeder;

class InstitutionSeeder extends Seeder
{
    public function __construct(
        private InstitutionClassifierRepository $institutionClassifierRepository,
        private ClassifierValueRepository $classifierValueRepository,
        private ClassifierRepository $classifierRepository
    )
    {
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $institutions = include(database_path('defaults/institutions.php'));

        foreach ($institutions as $entry) {
            $existing = $this->institutionClassifierRepository->findBy('reg_nr', $entry['reg_nr']);

            if ($existing) {
                $existing->name = $entry['name'];
                $existing->update();
                continue;
            }

            $institutionType = $this->classifierValueRepository->getClassifierValueByCodes('KL28', str_replace(' ', '_', $entry['institution_type_name']));

            if (!$institutionType) {
                $classifier = $this->classifierRepository->findBy('unique_code', 'KL28');
                $institutionType = $this->classifierValueRepository->store([
                    'value_code' => str_replace(' ', '_', $entry['institution_type_name']),
                    'translation' => $entry['institution_type_name'],
                    'classifier_id' => $classifier->id
                ]);
            }

            $this->institutionClassifierRepository->store([
                'reg_nr' => $entry['reg_nr'],
                'name' => $entry['name'],
                'institution_type_classifier_value_id' => $institutionType->id,
            ]);
        }
    }
}
