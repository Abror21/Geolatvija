<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/status', function () {
    return response()->json(
        ['code' => '200', 'message' => 'Service is up and running!']
    )->withHeaders(
        ["X-Response-UUID" => Str::uuid(), "X-Response-Timestamp" => time()]
    );
});
