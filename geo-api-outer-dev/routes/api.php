<?php

use App\Http\Controllers\Amk\AddressSearchComponentController;
use App\Http\Controllers\DppsController;
use App\Http\Controllers\GeoServerController;
use App\Http\Controllers\PaymentModuleController;
use App\Http\Controllers\VzdController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TapisController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::group(['middleware' => ['auth']], function () {
    Route::group(['prefix' => 'tapis'], function () {
        Route::get('/planned-documents', [TapisController::class, 'getPlannedDocuments']);
        Route::get('/planned-documents/{id}', [TapisController::class, 'getPlannedDocument']);
        Route::post('/proposal-submit', [TapisController::class, 'proposalSubmit']);
        Route::get('/my-discussions', [TapisController::class, 'myDiscussions']);
        Route::get('/get-discussion-answer', [TapisController::class, 'getDiscussionAnswers']);
        Route::get('/get-discussion-answer/{id}', [TapisController::class, 'getDiscussionAnswer']);
        Route::get('/get-notification-groups', [TapisController::class, 'getNotificationGroups']);
        Route::get('/get-user-notifications/{id}', [TapisController::class, 'getUserNotifications']);
        Route::post('/create-user-notification/', [TapisController::class, 'createUserNotification']);
        Route::put('/update-user-notification/{id}', [TapisController::class, 'updateUserNotification']);
        Route::delete('/delete-user-notification/{id}', [TapisController::class, 'deleteUserNotification']);
        Route::post('/ws/create_or_update_person', [TapisController::class, 'createUserInTapis']);
        Route::post('/ws/generate_and_send_parcel_data_email ', [TapisController::class, 'parcelDataEmail']);
        Route::get('/organizations', [TapisController::class, 'getOrganizationsForPlannedDocuments']);
        Route::post('/projects', [TapisController::class, 'createProject']);
        Route::patch('/projects/{id}', [TapisController::class, 'updateProject']);
        Route::get('/projects/{id}', [TapisController::class, 'getProject']);
        Route::get('/projects', [TapisController::class, 'getAllProjects']);
        Route::post('/votes', [TapisController::class, 'voteForProject']);
        Route::get('/organisations', [TapisController::class, 'getOrganisations']);
        Route::post('/notification_configurations', [TapisController::class, 'postNotificationConfig']);
        Route::get('/notification_configurations', [TapisController::class, 'getNotificationConfig']);
        Route::get('/participation_budgets/{id}', [TapisController::class, 'getParticipationBudget']);
        Route::get('/participation_budgets', [TapisController::class, 'getParticipationBudgets']);
        Route::any('{path}', [TapisController::class, 'autoRedirect'])->where('path', '.+');
    });

    //AMK routes
    Route::group(['prefix' => 'amk'], function () {
        Route::get('/address', [AddressSearchComponentController::class, 'address']);
        Route::get('/address-struct', [AddressSearchComponentController::class, 'addressStruct']);
        Route::get('/resolve', [AddressSearchComponentController::class, 'resolve']);
    });

    Route::group(['prefix' => 'vzd'], function () {
        Route::get('/initiate-file-download', [VzdController::class, 'initiateFileDownload']);
    });

    Route::group(['prefix' => 'dpps'], function () {
        Route::post('/api/DPPSPackage/create-api', [DppsController::class, 'createParentLink']);
        Route::post('/api/DPPSPackage/update-api', [DppsController::class, 'updateParentLink']);
        Route::post('/api/DPPSPackage/delete-api', [DppsController::class, 'deleteParentLink']);
        Route::post('/api/DPPSPackage/create-access', [DppsController::class, 'createChildLink']);
        Route::post('/api/DPPSPackage/monitor-access', [DppsController::class, 'monitorLink']);
        Route::post('/api/DPPSPackage/capabilities', [DppsController::class, 'capabilities']);
    });

    Route::group(['prefix' => 'geoserver'], function () {
        Route::get('/vraa/wfs', [GeoServerController::class, 'getCadastrs']);
    });

    Route::group(['prefix' => 'vraa'], function () {
        Route::post('savePayment', [PaymentModuleController::class, 'savePaymentRequest']);
        Route::post('checkStatus', [PaymentModuleController::class, 'checkPaymentRequestStatus']);
    });
});
