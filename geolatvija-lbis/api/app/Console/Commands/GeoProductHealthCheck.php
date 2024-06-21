<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Repositories\BackgroundTaskRepository;
use App\Repositories\ClassifierValueRepository;
use App\Repositories\GeoProducts\GeoProductFileRepository;
use App\Repositories\GeoProducts\GeoProductRepository;
use App\Repositories\GeoProducts\GeoProductServiceRepository;
use App\Repositories\InstitutionClassifierRepository;
use App\Repositories\UserRepository;
use Carbon\Carbon;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class GeoProductHealthCheck extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'geo_product:health_check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check if geoproducts are running and are healthy';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(
        private readonly GeoProductServiceRepository $geoProductServiceRepository,
        private readonly GeoProductRepository $geoProductRepository,
        private readonly GeoProductFileRepository $geoProductFileRepository,
        private readonly BackgroundTaskRepository $backgroundTaskRepository,
        private readonly ClassifierValueRepository $classifierValueRepository,
        private readonly InstitutionClassifierRepository $institutionClassifierRepository
    )
    {
        parent::__construct();
    }


    public function handle()
    {
        $task = $this->backgroundTaskRepository->findBy('command', $this->signature);

        //GEO-480
        $started = Carbon::now();
        $task->executed_at = $started;
        $task->update();

        try {
            $activeGeoProductServices = $this->geoProductServiceRepository->findBy('is_public', true, true);

            $data = [];

            $featureDownloadClassifierValue = $this->classifierValueRepository->getClassifierValueByCodes('KL9', 'FEATURE_DOWNLOAD');
            foreach ($activeGeoProductServices as $activeGeoProductService) {
                try {
                    $serviceLink = $activeGeoProductService->service_link;
                    $linkParams = explode('?', $serviceLink);
                    $serviceType = $this->classifierValueRepository->findById($activeGeoProductService->service_type_classifier_value_id);
                    if (!isset($linkParams[1])) {
                        if ($serviceType->value_code !== 'FEATURE_DOWNLOAD') {
                            $type = '';
                            switch ($serviceType->value_code) {
                                case 'WFS':
                                    $type = 'WFS';
                                    break;
                                case 'WMS':
                                case 'INSPIRE_VIEW':
                                    $type = 'WMS';
                                    break;
                            }

                            $serviceLink = $linkParams[0] . '?' . 'SERVICE=' . $type . '&REQUEST=GetCapabilities';
                        }
                    }

                    $hasFailed = 0;
                    $type = '';
                    $response = $this->makeRequest('GET', $serviceLink, []);

                    //check if has title which means successfull response
                    if (!is_array($response) && !str_contains($response, 'Title>') && $featureDownloadClassifierValue->id != $activeGeoProductService->service_type_classifier_value_id) {
                        $hasFailed = $hasFailed + 1;
                        $type = 'Title>';
                    }

                    //check if contains exception
                    if (!is_array($response) && str_contains($response, 'ExceptionReport>') || !is_array($response) && str_contains($response, 'ServiceException>')) {
                        $hasFailed = $hasFailed + 1;
                        $type = 'ExceptionReport>';
                    }

                    //checks if is valid xml
                    try {
                        if (!is_array($response)) {
                            simplexml_load_string($response);
                        }
                    } catch (\Exception $e) {
                        $hasFailed = $hasFailed + 1;
                        $type = 'valid XML response';
                    }

                    //checks if error is in 400 or 500 range
                    if (is_array($response)) {
                        $hasFailed = $hasFailed + 1;
                        $type = 'https status code';
                    }

                    $activeGeoProductService->last_checked = Carbon::now();

                    if ($hasFailed) {
                        $activeGeoProductService->fail_amount = $activeGeoProductService->fail_amount + 1;
                    } else {
                        $activeGeoProductService->fail_amount = 0;
                    }

                    if ($activeGeoProductService->fail_amount >= 3) {
                        $geoProduct = $this->geoProductRepository->findById($activeGeoProductService->geo_product_id);
                        $serviceTypeCode = $this->classifierValueRepository->findById($activeGeoProductService->service_type_classifier_value_id);
                        $institutionClassifier = $this->institutionClassifierRepository->findById($geoProduct->owner_institution_classifier_id);

                        $divType = match ($serviceTypeCode->value_code) {
                            'INSPIRE_VIEW' => 'Skatīšanās pakalpe (INSPIRE)',
                            'FEATURE_DOWNLOAD' => 'Lejupielādes pakalpe (INSPIRE)',
                            'WFS' => 'Lejuplādes pakalpe (WFS)',
                            'WMS' => 'Skatīšanās pakalpe (WMS)',
                            'WMTS' => 'Skatīšanās pakalpe (WMTS)',
                            default => '',
                        };

                        $data[] = [
                            'name' => $geoProduct->name,
                            'type' => $divType,
                            'data_holder' => $institutionClassifier->name,
                            'time' => Carbon::now()->format('Y.m.d m:s'),
                            'error' => $type,
                            'is_ftp' => false,
                            'url' => config('geo.base_frontend_uri') . '/main?geoProductId=' . $geoProduct->id,
                        ];
                    }

                    $activeGeoProductService->update();
                } catch (\Exception $e) {
                    $activeGeoProductService->fail_amount = $activeGeoProductService->fail_amount + 1;
                    $activeGeoProductService->update();
                }
            }

            $activeGeoProductFiles = $this->geoProductFileRepository->findBy('is_public', true, true);

            foreach ($activeGeoProductFiles as $activeGeoProductFile) {
                $geoProduct = $this->geoProductRepository->findById($activeGeoProductFile->geo_product_id);
                $institutionClassifier = $this->institutionClassifierRepository->findById($geoProduct->owner_institution_classifier_id);

                $hasFailed = 0;
                $type = '';

                if ($activeGeoProductFile->ftp_address) {
                    $ftp_server = $activeGeoProductFile->ftp_address;
                    $u = $activeGeoProductFile->ftp_username;
                    $p = $activeGeoProductFile->ftp_password;

                    try {
                        $isFtps = false;
                        if (str_contains($ftp_server, 'ftp://')) {
                            $ftp_server = str_replace('ftp://', '', $ftp_server);
                        }

                        if (str_contains($ftp_server, 'ftps://')) {
                            $ftp_server = str_replace('ftps://', '', $ftp_server);
                            $isFtps = true;
                        }

                        if (str_contains($ftp_server, '/')) {
                            $ftp_server = str_replace('/', '', $ftp_server);
                        }

                        $address = explode(':', $ftp_server)[0];
                        $port = explode(':', $ftp_server)[1] ?? 21;
                        
                        if ($isFtps) {
                            $ftp_conn = ftp_ssl_connect($address, $port);
                        } else {
                            $ftp_conn = ftp_connect($address, $port);
                        }

                        ftp_login($ftp_conn, $u, $p);
                        ftp_pasv($ftp_conn, true);

                        $contents = ftp_rawlist($ftp_conn, '/');

                        ftp_close($ftp_conn);

                        if (!$contents) {
                            $hasFailed = $hasFailed + 1;
                            $type = 'Connect';
                        }
                    } catch (\Exception $e) {
                        $hasFailed = $hasFailed + 1;
                        $type = 'Connect';
                    }

                    $activeGeoProductFile->last_checked = Carbon::now();

                    if ($hasFailed) {
                        $activeGeoProductFile->fail_amount = $activeGeoProductFile->fail_amount + 1;
                    } else {
                        $activeGeoProductFile->fail_amount = 0;
                    }

                    if ($activeGeoProductFile->fail_amount >= 3) {
                        $geoProduct = $this->geoProductRepository->findById($activeGeoProductFile->geo_product_id);

                        $data[] = [
                            'id' => $geoProduct->id,
                            'name' => $geoProduct->name,
                            'type' => $activeGeoProductFile->ftp_address,
                            'data_holder' => $institutionClassifier->name,
                            'time' => Carbon::now()->format('Y.m.d m:s'),
                            'error' => $type,
                            'is_ftp' => true,
                            'url' => config('geo.base_frontend_uri') . '/geoproducts/' . $geoProduct->id,
                        ];
                    }

                    $activeGeoProductFile->update();
                }
            }

            $currentDateTime = Carbon::now('Europe/Riga');
            $formattedDateTime = $currentDateTime->format('d.m.Y H:i');

            $roles = Role::whereHas('userGroup', function (Builder $query) {
                $query->where('code', 'admin');
            })->whereNotNull('roles.email')->with('user')->get();

            if (count($data)) {
                foreach ($roles as $role) {
                    if ($role->user->send_email) {
                        Mail::send('geoproduct_failed', ['data' => $data], function ($message) use ($formattedDateTime, $role) {
                            $message->to($role->email, $role->user->name)
                                ->subject('Datu Izplatīšanas Veida Fona Pārbaude, ' . $formattedDateTime);
                        });
                    }
                }
            }
        } catch (\Exception $e) {
            $task->failed = true;
            $task->update();
            throw $e;
        }

        $ended = Carbon::now();

        $task->execution_time = $started->diffInSeconds($ended);
        $task->failed = false;
        $task->update();
    }


    public function makeRequest($method, $url, $options): mixed
    {
        $client = new Client();

        try {
            $response = $client->request($method, $url, $options);

            return $response->getBody()->__toString();

        } catch (ClientException $e) {
            $errorResponse = json_decode($e->getResponse()->getBody(), true);

            Log::error($e->getMessage(), $e->getTrace());

            if (isset($errorResponse['error'])) {
                throw new \Exception($errorResponse['error'], $e->getCode());
            }

            if (!empty($errorResponse)) {
                return $errorResponse;
            }

            return ["error" => ["code" => $e->getCode(), "message" => "API call error"]];
        }
    }

}
