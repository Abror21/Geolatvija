<?php

use App\Http\Controllers\AtomController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BackgroundTaskController;
use App\Http\Controllers\EnumController;
use App\Http\Controllers\FtpController;
use App\Http\Controllers\GeoProductController;
use App\Http\Controllers\GeoProductOrderController;
use App\Http\Controllers\GoogleAnalyticsController;
use App\Http\Controllers\InstitutionClassifierController;
use App\Http\Controllers\Integrations\AmkController;
use App\Http\Controllers\Integrations\TapisController;
use App\Http\Controllers\LicenceInstitutionController;
use App\Http\Controllers\LicenceTemplateController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\NotificationGroupController;
use App\Http\Controllers\OrderDataHolderController;
use App\Http\Controllers\OrderedLicenceController;
use App\Http\Controllers\ProcessingTypeController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RightsController;
use App\Http\Controllers\StorageController;
use App\Http\Controllers\SystemSettingController;
use App\Http\Controllers\SystemSettingFileController;
use App\Http\Controllers\ThematicUserGroupController;
use App\Http\Controllers\TooltipController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserEmailVerificationController;
use App\Http\Controllers\UserEmbedsController;
use App\Http\Controllers\UserGroupController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserNotificationsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//Route::get('fake-login', 'ExampleController@login'); //todo only used for testing purposes or latvijalv is offline

Route::get('plugins/google/{id}', [GoogleAnalyticsController::class, 'show']);

//public
Route::middleware([])->group(function () {
    Route::get('saml2', [\App\Http\Controllers\Saml2Controller::class, 'saml2Uuid'])->name('saml2Uuid');
    Route::get('saml2/logout', [\App\Http\Controllers\Saml2Controller::class, 'saml2Logout'])->name('saml2LogoutUrl');
});

Route::get('ui-menu', 'UiMenuController@getUserUiMenuList');
Route::get('ui-menu/{code}/content', 'UiMenuController@getUiMenuByCode');
Route::get('ui-menu-footer', 'UiMenuController@getFooterUiMenuList');

Route::group(['prefix' => 'amk'], function () {
    Route::get('/address', [AmkController::class, 'address']);
    Route::get('/address-struct', [AmkController::class, 'addressStruct']);
    Route::get('/resolve', [AmkController::class, 'resolve']);
});

Route::group(['prefix' => 'atom'], function () {
    Route::get('/banner', [AtomController::class, 'banner']);
    Route::get('/service-css', [AtomController::class, 'serviceCss']);
    Route::get('/service-style', [AtomController::class, 'serviceStyle']);
    Route::get('/{uuid}/datasetatoma', [AtomController::class, 'getAtom']);
    Route::get('/{uuid}/serviceatoma', [AtomController::class, 'getAtom']);
    Route::get('/{uuid}/file', [AtomController::class, 'downloadFile']);
});


//StorageController
Route::group(['prefix' => 'storage'], function () {
    Route::post('upload', [StorageController::class, 'store']);
    Route::get('/', [StorageController::class, 'show']);
    Route::get('{id}', [StorageController::class, 'downloadFile']);
});

Route::group(['prefix' => 'classifiers'], function () {
    Route::get('/select/{code}', 'ClassifierController@getClassifierValuesForSelect');
});

Route::group(['prefix' => 'system-settings'], function () {
    Route::get('/frontend', [SystemSettingController::class, 'frontend']);
    Route::get('/session-inactivity-time', [SystemSettingController::class, 'getSessionInactivityTime']);
    Route::get('/div-file-availability-time', [SystemSettingController::class, 'getDivFileDownloadAvailabilityDuration']);
});

Route::group(['prefix' => 'public'], function () {
    Route::get('/geoproducts', [GeoProductController::class, 'getPublicGeoproducts']);
    Route::get('/geoproducts-search', [GeoProductController::class, 'getPublicGeoproductsWithoutCaptcha']);
    Route::get('/geoproducts/{id}', [GeoProductController::class, 'getPublicGeoproduct']);
    Route::post('/geoproducts/other-view/{id}', [GeoProductController::class, 'otherView']);
    Route::get('/geoproducts/dpps-capabilities/{id}/{dppsUuid}', [GeoProductController::class, 'dppsCapabilities']);
    Route::get('/notifications', [NotificationController::class, 'getPublicNotificationList']);
});

Route::group(['prefix' => 'captcha'], function () {
    Route::get('/show', [SystemSettingController::class, 'captchaShow']);
});

Route::group(['prefix' => 'user-embeds'], function () {
    Route::get('/{uuid}/uuid', [UserEmbedsController::class, 'uuid']);
});


//from api-outer
Route::middleware(['auth.api.outer'])->group(function () {
    Route::group(['prefix' => 'background-task'], function () {
        Route::get('/finish-task', [BackgroundTaskController::class, 'finishTask']);
    });
});

Route::middleware(['auth:sanctum', 'ability:refresh_token'])->group(function () {
    Route::get('/refresh-token', [AuthController::class, 'refreshToken']);
    Route::get('/refresh-itself', [AuthController::class, 'refreshItself']);
    Route::get('/inactivity-token', [AuthController::class, 'inactivityToken']);
});

Route::middleware(['auth:sanctum', 'ability:general,inactivity_token'])->group(function () {
    Route::get('/token/{id}', [AuthController::class, 'getToken']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware(['auth:sanctum', 'ability:general'])->group(function () {
    Route::get('/me', [UserController::class, 'me']);

    //GeoProductOrderController
    Route::group(['prefix' => 'geoproduct-orders'], function () {
        Route::get('/', [GeoProductOrderController::class, 'getGeoproductOrders']);
        Route::get('/{id}', [GeoProductOrderController::class, 'getGeoproductOrder']);
        Route::post('/', [GeoProductOrderController::class, 'store']);
        Route::post('/{id}', [GeoProductOrderController::class, 'update']);
        Route::patch('/{id}', [GeoProductOrderController::class, 'updateOrderStatus']);
        Route::get('/{id}/download', [GeoProductOrderController::class, 'download']);
        Route::get('{id}/status', [GeoProductOrderController::class, 'status']);
        Route::patch('{id}/status-update', [GeoProductOrderController::class, 'statusUpdate']);
    });

    //UserController
    Route::group(['prefix' => 'users'], function () {
        Route::get('/', [UserController::class, 'getUsers'])->middleware('ability:user_management');
        Route::patch('/', [UserController::class, 'updateAccount']); // My profile
        Route::post('/create', [UserController::class, 'store'])->middleware('ability:user_management');
        Route::post('/extend', [UserController::class, 'extend'])->middleware('ability:user_management');
        Route::get('/select', [UserController::class, 'select'])->middleware('ability:user_management,geoproduct_report');
        Route::get('/{id}', [UserController::class, 'show'])->middleware('ability:user_management');
        Route::patch('/{id}', [UserController::class, 'update'])->middleware('ability:user_management');
        Route::delete('/', [UserController::class, 'delete'])->middleware('ability:user_management');
    });

    Route::group(['prefix' => 'tapis'], function () {
        Route::post('/proposal-submit', [TapisController::class, 'proposalSubmit']);
        Route::get('/my-discussions', [TapisController::class, 'myDiscussions']);
        Route::get('/get-discussion-answer/{id}', [TapisController::class, 'getDiscussionAnswer']);
        Route::post('/parcel-data-email', [TapisController::class, 'parcelDataEmail']);
        Route::post('/create-projects', [TapisController::class, 'createProject']);
        Route::patch('/create-projects/{id}', [TapisController::class, 'updateProject']);
        Route::post('/vote-for-project', [TapisController::class, 'voteForProject']);
    });

    //UserGroupController
    Route::group(['prefix' => 'roles'], function () {
        Route::get('/', [UserGroupController::class, 'getRoles'])->middleware('ability:user_management');
        Route::post('/', [UserGroupController::class, 'store'])->middleware('ability:user_management');
        Route::delete('/', [UserGroupController::class, 'delete'])->middleware('ability:user_management');
        Route::get('/groups-select', [UserGroupController::class, 'userGroupSelect']);
        Route::get('/{id}', [UserGroupController::class, 'show'])->middleware('ability:user_management');
        Route::patch('/{id}', [UserGroupController::class, 'update'])->middleware('ability:user_management');
    });

    //RightsController
    Route::group(['prefix' => 'rights'], function () {
        Route::get('/', [RightsController::class, 'getRights'])->middleware('ability:user_management');
        Route::patch('/update', [RightsController::class, 'update'])->middleware('ability:user_management');
    });

    //ClassifierController
    Route::group(['prefix' => 'classifiers'], function () {
        Route::get('/', 'ClassifierController@getClassifiersList')->middleware('ability:classifier');
        Route::post('/', 'ClassifierController@storeClassifier')->middleware('ability:classifier');
        Route::delete('/', 'ClassifierController@deleteClassifiers')->middleware('ability:classifier');
        Route::get('/{id}', 'ClassifierController@getClassifierById')->middleware('ability:classifier');

        Route::patch('/{id}', 'ClassifierController@updateClassifier')->middleware('ability:classifier');
        Route::get('/{id}/values', 'ClassifierController@getClassifiersValuesList')->middleware('ability:classifier');
        Route::post('/{id}/values', 'ClassifierController@storeClassifierValue')->middleware('ability:classifier');
        Route::delete('/{id}/values', 'ClassifierController@deleteClassifierValues')->middleware('ability:classifier');
        Route::patch('/{id}/values/{classifierId}', 'ClassifierController@updateClassifierValue')->middleware('ability:classifier');
        Route::get('/{id}/values/{classifierId}', 'ClassifierController@getClassifierValue')->middleware('ability:classifier');
    });

    Route::group(['prefix' => 'institution-classifiers'], function () {
        Route::get('/', [InstitutionClassifierController::class, 'index'])->middleware('ability:institution_classifier');
        Route::post('/', [InstitutionClassifierController::class, 'store'])->middleware('ability:institution_classifier');
        Route::get('/select', [InstitutionClassifierController::class, 'select']);
        Route::patch('/{id}', [InstitutionClassifierController::class, 'update'])->middleware('ability:institution_classifier');
        Route::delete('/', [InstitutionClassifierController::class, 'deleteInstitutionClassifiers'])->middleware('ability:institution_classifier');
        Route::get('/{id}', [InstitutionClassifierController::class, 'show'])->middleware('ability:institution_classifier');


    });

    //NotificationController
    Route::group(['prefix' => 'notifications'], function () {
        Route::get('/', [NotificationController::class, 'getNotificationList'])->middleware('ability:notification');
        Route::post('/', [NotificationController::class, 'storeNotification'])->middleware('ability:notification');
        Route::delete('/', [NotificationController::class, 'deleteNotifications'])->middleware('ability:notification');
        Route::get('/{id}', [NotificationController::class, 'getNotification'])->middleware('ability:notification');
        Route::patch('/{id}', [NotificationController::class, 'updateNotification'])->middleware('ability:notification');
        Route::post('/{id}/publish', [NotificationController::class, 'publishNotification'])->middleware('ability:notification');
        Route::post('/{id}/unpublish', [NotificationController::class, 'unpublishNotification'])->middleware('ability:notification');
    });

    //UiMenuController

    Route::get('ui-menu-list', 'UiMenuController@getUiMenuList')->middleware('ability:ui_menu');
    Route::get('ui-menu-select', 'UiMenuController@getSelectUiMenuList');
    Route::get('ui-menu-list/{id}', 'UiMenuController@getUiMenu')->middleware('ability:ui_menu');
    Route::patch('ui-menu/{id}', 'UiMenuController@updateUiMenu')->middleware('ability:ui_menu');
    Route::post('ui-menu', 'UiMenuController@createUiMenu')->middleware('ability:ui_menu');
    Route::delete('ui-menu', 'UiMenuController@delete')->middleware('ability:ui_menu');

    //GeoProductsController
    Route::group(['prefix' => 'geoproducts'], function () {
        Route::get('/', [GeoProductController::class, 'getGeoproducts'])->middleware('ability:geoproduct');
        Route::post('/', [GeoProductController::class, 'store'])->middleware('ability:geoproduct');
        Route::delete('/', [GeoProductController::class, 'delete'])->middleware('ability:geoproduct');

        Route::get('/geoproducts-by-user', [GeoProductController::class, 'selectGeoProductsByUser'])->middleware('ability:geoproduct');
        Route::get('/select', [GeoProductController::class, 'select'])->middleware('ability:geoproduct,geoproduct_report');
        Route::post('/check-service-link', [GeoProductController::class, 'checkServiceLink'])->middleware('ability:geoproduct');
        Route::post('/import', [GeoProductController::class, 'import'])->middleware('ability:geoproduct');
        Route::get('/{id}', [GeoProductController::class, 'getGeoproduct'])->middleware('ability:geoproduct');
        Route::patch('/{id}', [GeoProductController::class, 'updateGeoproduct'])->middleware('ability:geoproduct');
        Route::post('/{id}/publish', [GeoProductController::class, 'publishGeoproduct'])->middleware('ability:geoproduct');
        Route::post('/{id}/unpublish', [GeoProductController::class, 'unpublishGeoproduct'])->middleware('ability:geoproduct');
        Route::post('/{id}/copy', [GeoProductController::class, 'copyGeoproduct'])->middleware('ability:geoproduct');
        Route::post('/{id}/inspire-response', [GeoProductController::class, 'checkInspireValidation'])->middleware('ability:geoproduct');
    });

    Route::group(['prefix' => 'ftp'], function () {
        Route::post('load', [FtpController::class, 'loadFtpFiles'])->middleware('ability:geoproduct');
        Route::get('load/{id}', [FtpController::class, 'getFiles'])->middleware('ability:geoproduct');
        Route::post('save/{id}', [FtpController::class, 'save'])->middleware('ability:geoproduct');
    });

    Route::group(['prefix' => 'system-settings'], function () {
        Route::patch('/captcha', [SystemSettingController::class, 'captchaUpdate'])->middleware('ability:plugins');
        Route::get('/', [SystemSettingController::class, 'index'])->middleware('ability:system_setting');
        Route::get('/{id}', [SystemSettingController::class, 'show'])->middleware('ability:system_setting');
        Route::patch('/{id}', [SystemSettingController::class, 'update'])->middleware('ability:system_setting');
    });

    Route::group(['prefix' => 'system-settings-files'], function () {
        Route::get('/', [SystemSettingFileController::class, 'index'])->middleware('ability:system_settings_file');
        Route::post('/', [SystemSettingFileController::class, 'store'])->middleware('ability:system_settings_file');
        Route::delete('/', [SystemSettingFileController::class, 'delete'])->middleware('ability:system_settings_file');
        Route::get('/size', [SystemSettingFileController::class, 'sizeShow'])->middleware('ability:system_settings_file');
        Route::patch('/size', [SystemSettingFileController::class, 'sizeUpdate'])->middleware('ability:system_settings_file');
        Route::get('/{id}', [SystemSettingFileController::class, 'show'])->middleware('ability:system_settings_file');
        Route::patch('/{id}', [SystemSettingFileController::class, 'update'])->middleware('ability:system_settings_file');
    });

    Route::group(['prefix' => 'processing-types'], function () {
        Route::get('/', [ProcessingTypeController::class, 'index'])->middleware('ability:processing_type');
        Route::post('/', [ProcessingTypeController::class, 'store'])->middleware('ability:processing_type');
        Route::delete('/', [ProcessingTypeController::class, 'delete'])->middleware('ability:processing_type');
        Route::get('select', [ProcessingTypeController::class, 'select'])->middleware('ability:processing_type,geoproduct');
        Route::get('/{id}', [ProcessingTypeController::class, 'show'])->middleware('ability:processing_type');
        Route::patch('/{id}', [ProcessingTypeController::class, 'update'])->middleware('ability:processing_type');
    });

    Route::group(['prefix' => 'background-tasks'], function () {
        Route::get('/', [BackgroundTaskController::class, 'index'])->middleware('ability:background_task');
        Route::post('/run', [BackgroundTaskController::class, 'run'])->middleware('ability:background_task');
        Route::get('/{id}', [BackgroundTaskController::class, 'show'])->middleware('ability:background_task');
        Route::patch('/{id}', [BackgroundTaskController::class, 'update'])->middleware('ability:background_task');
        Route::post('/{id}/disable', [BackgroundTaskController::class, 'disable'])->middleware('ability:background_task');
    });

    Route::group(['prefix' => 'reports'], function () {
        Route::get('', [ReportController::class, 'report'])->middleware('ability:geoproduct_report');
        Route::get('export', [ReportController::class, 'export'])->middleware('ability:geoproduct_report');
        Route::get('view-count', [ReportController::class, 'viewCount'])->middleware('ability:geoproduct_report');
    });

    Route::group(['prefix' => 'licence-management-institutions'], function () {
        Route::get('/', [LicenceInstitutionController::class, 'index'])->middleware('ability:licence_management');
        Route::post('/', [LicenceInstitutionController::class, 'store'])->middleware('ability:licence_management');
        Route::delete('/', [LicenceInstitutionController::class, 'delete'])->middleware('ability:licence_management');
        Route::get('/select', [LicenceInstitutionController::class, 'select']);
        Route::get('/{id}', [LicenceInstitutionController::class, 'show'])->middleware('ability:licence_management');
        Route::patch('/{id}', [LicenceInstitutionController::class, 'update'])->middleware('ability:licence_management');
        Route::patch('/{id}/public', [LicenceInstitutionController::class, 'public'])->middleware('ability:licence_management');
    });

    Route::group(['prefix' => 'licence-management-templates'], function () {
        Route::get('/', [LicenceTemplateController::class, 'index'])->middleware('ability:licence_management');
        Route::post('/', [LicenceTemplateController::class, 'store'])->middleware(['ability:licence_management,is_admin']);
        Route::delete('/', [LicenceTemplateController::class, 'delete'])->middleware(['ability:licence_management,is_admin']);
        Route::get('/{id}', [LicenceTemplateController::class, 'show'])->middleware('ability:licence_management');
        Route::patch('/{id}', [LicenceTemplateController::class, 'update'])->middleware(['ability:licence_management,is_admin']);
        Route::patch('/{id}/public', [LicenceTemplateController::class, 'public'])->middleware(['ability:licence_management,is_admin']);
    });

    Route::group(['prefix' => 'licence-masks'], function () {
        Route::get('/', [LicenceTemplateController::class, 'masks'])->middleware('ability:licence_management');
    });


    Route::group(['prefix' => 'thematic-user-groups'], function () {
        Route::get('/', [ThematicUserGroupController::class, 'index'])->middleware('ability:thematic_user_group');
        Route::post('/', [ThematicUserGroupController::class, 'store'])->middleware('ability:thematic_user_group');
        Route::delete('/', [ThematicUserGroupController::class, 'delete'])->middleware('ability:thematic_user_group');
        Route::get('/search-user', [ThematicUserGroupController::class, 'searchUser'])->middleware('ability:thematic_user_group');
        Route::get('/select', [ThematicUserGroupController::class, 'select']);
        Route::get('/{id}', [ThematicUserGroupController::class, 'show'])->middleware('ability:thematic_user_group');
        Route::patch('/{id}', [ThematicUserGroupController::class, 'update'])->middleware('ability:thematic_user_group');
    });

    Route::group(['prefix' => 'tooltips'], function () {
        Route::get('/', [TooltipController::class, 'index'])->middleware('ability:tooltip');
        Route::post('/', [TooltipController::class, 'store'])->middleware('ability:tooltip');
        Route::delete('/', [TooltipController::class, 'delete'])->middleware('ability:tooltip');
        Route::get('/values', [TooltipController::class, 'tooltips']);
        Route::get('/{id}', [TooltipController::class, 'show'])->middleware('ability:tooltip');
        Route::patch('/{id}', [TooltipController::class, 'update'])->middleware('ability:tooltip');
    });


    Route::group(['prefix' => 'ordered-licences'], function () {
        Route::get('/', [OrderedLicenceController::class, 'index'])->middleware('ability:ordered_licence');
        Route::get('{id}/download', [OrderedLicenceController::class, 'download'])->middleware('ability:ordered_licence');
    });

    Route::group(['prefix' => 'orders-data-holder'], function () {
        Route::get('/', [OrderDataHolderController::class, 'index'])->middleware('ability:orders_data_holder');
        Route::get('/{id}', [OrderDataHolderController::class, 'show'])->middleware('ability:orders_data_holder');
    });

    // UserNotificationsController
    Route::group(['prefix' => 'user-notifications'], function () {
        Route::get('/', [UserNotificationsController::class, 'index']);
        Route::delete('/', [UserNotificationsController::class, 'delete']);
        Route::post('/', [UserNotificationsController::class, 'store']);
        Route::patch('/{id}', [UserNotificationsController::class, 'update']);
        Route::get('/{id}', [UserNotificationsController::class, 'show']);
    });

    // UserNotificationsGroupController
    Route::group(['prefix' => 'notification-groups'], function () {
        Route::get('/', [NotificationGroupController::class, 'all']);
    });

    // UserEmbedsController
    Route::group(['prefix' => 'user-embeds'], function () {
        Route::get('/', [UserEmbedsController::class, 'index']);
        Route::delete('/{id}', [UserEmbedsController::class, 'delete']);
        Route::post('/', [UserEmbedsController::class, 'store']);
        Route::patch('/{id}', [UserEmbedsController::class, 'update']);
        Route::get('/{id}', [UserEmbedsController::class, 'show']);
    });

    // UserEmailVerificationController
    Route::group(['prefix' => 'user-email'], function () {
        Route::post('/generate', [UserEmailVerificationController::class, 'generate']);
    });


    Route::group(['prefix' => 'plugins'], function () {
        Route::patch('/google/{id}', [GoogleAnalyticsController::class, 'update']);
        Route::post('/captcha', [SystemSettingController::class, 'submitCaptcha']);
    });

    Route::get('/enums/{type}', [EnumController::class, 'select']);
});

Route::post('/verify-email', [UserEmailVerificationController::class, 'verify']);

Route::group(['prefix' => 'tapis'], function () {
    Route::get('/planned-documents', [TapisController::class, 'getPlannedDocuments']);
    Route::get('/planned-documents-search', [TapisController::class, 'getPlannedDocumentsWithoutCaptcha']);
    Route::get('/planned-documents/{id}', [TapisController::class, 'getPlannedDocument']);
    Route::get('/organizations', [TapisController::class, 'getPlannedDocumentsOrganizations']);
    Route::get('/projects', [TapisController::class, 'getAllProjects']);
    Route::get('/organisations', [TapisController::class, 'getOrganisations']);
    Route::get('/projects/{id}', [TapisController::class, 'getProject']);
    Route::post('/notification_configurations', [TapisController::class, 'postNotificationConfig']);
    Route::get('/notification_configurations', [TapisController::class, 'getNotificationConfig']);
    Route::get('/participation_budgets/{id}', [TapisController::class, 'getParticipationBudget']);
    Route::get('/participation_budgets/', [TapisController::class, 'getParticipationBudgets']);

    Route::any('/geoserver/{path}', [TapisController::class, 'autoRedirect'])->where('path', '.+');
});

//Route::group(['prefix' => 'geoserver'], function () {
//    Route::get('/vraa/wfs', [GeoServerController::class, 'getCadastrs']);
//    Route::get('/gwc/{path}', [GeoServerController::class, 'gwc'])->where('path', '.+');
//});



