<?php

use App\Http\Controllers\Integrations\GeoNetworkController;
use Illuminate\Support\Facades\Route;


Route::get('/opendata/{path}', [GeoNetworkController::class, 'opendataProxy'])->where('path', '.+');
Route::get('/inspire/{path}', [GeoNetworkController::class, 'proxy'])->where('path', '.+');
Route::get('/srv/api/{path}', [GeoNetworkController::class, 'metadata'])->where('path', '.+');



