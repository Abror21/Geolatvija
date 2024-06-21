<?php

namespace App\Http\Controllers;



use Illuminate\Support\Facades\File;

class MapController extends Controller
{
    public function __construct()
    {
    }

    /**
     * @description Get Map (map.js)
     */
    public function map()
    {
        $file = File::get(public_path() . '/' . 'map.js');

        return $this->successResponse($file, 200, ['Content-Type' => 'application/javascript']);
    }
}
