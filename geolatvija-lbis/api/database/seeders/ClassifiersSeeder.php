<?php

namespace Database\Seeders;


use App\Models\Classifier;
use App\Models\ClassifierValue;
use App\Repositories\ClassifierRepository;
use App\Repositories\ClassifierValueRepository;

use Illuminate\Database\Seeder;

/**
 * Class ClassifierSeeder
 * @package Database\Seeders
 */
class ClassifiersSeeder extends Seeder
{
    public function __construct(private ClassifierRepository $classifierRepository, private ClassifierValueRepository $classifierValueRepository)
    {
    }

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $classifiers = include_once(database_path('defaults/classifiers.php'));

        foreach ($classifiers as $classifier) {
            $values = $classifier["values"];
            unset($classifier["values"]);

            $existingClassifier = $this->classifierRepository->findBy("unique_code", $classifier['unique_code']);

            if ($existingClassifier) {
                $classifierModel = $this->classifierRepository->update($existingClassifier, $classifier);
            } else {
                $classifierModel = $this->classifierRepository->store($classifier);
            }

            foreach ($values as $value) {
                $value['classifier_id'] = $classifierModel->id;

                $existingClassifier = $this->classifierValueRepository->findClassifierValues($value['classifier_id'], $value['value_code']);

                if ($existingClassifier) {
                    $this->classifierValueRepository->update($existingClassifier, $value);
                    continue;
                }

                $this->classifierValueRepository->store($value);
            }
        }
    }
}
