<?php

namespace App\Services;

use App\Repositories\DummyRepository;

/**
 * Class ExampleService
 * @package App\Services
 */
class ExampleService extends BaseService
{
    /**
     * ExampleService constructor.
     * @param DummyRepository $dummyRepository
     */
    public function __construct(private DummyRepository $dummyRepository)
    {}

    public function example($userData)
    {
      return $userData;
    }

    public function dummy($options)
    {
        return $this->dummyRepository->getDummyList($options);
    }

}
