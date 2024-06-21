<?php

use App\Http\Controllers\Integrations\GeoNetworkController;
use App\Http\Controllers\Integrations\GeoServerController;
use Illuminate\Support\Facades\Route;

Route::middleware(['trust'])->group(function () {
    Route::get('/vraa/wfs', [GeoServerController::class, 'wfs']);
    Route::get('/vraa/wms', [GeoServerController::class, 'wms']);
    Route::get('/gwc/{path}', [GeoServerController::class, 'gwc'])->where('path', '.+');
});
