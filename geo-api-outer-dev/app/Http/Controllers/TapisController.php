<?php


namespace App\Http\Controllers;


use App\Services\API\LbisApi;
use App\Services\API\TapisAPI;
use Carbon\Carbon;
use DOMDocument;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use SimpleXMLElement;

/**
 * Class TapisController
 * @package App\Http\Controllers\Spor
 */
class TapisController extends Controller
{

    /**
     * LocationsController constructor.
     * @param TapisAPI $tapisApi
     */
    public function __construct(
        private TapisAPI $tapisApi,
        private LbisApi $lbisApi,
    ) {
    }

    /**
     * @param Request $request
     * @return Response|JsonResponse
     */
    public function getPlannedDocuments(Request $request): Response|JsonResponse
    {
        try {
            //todo make validation req

            $search = $request->input('search');
            $organization = $request->input('organization');
            $status = $request->input('status') ?? [];
            $bbox = $request->input('bbox');

            $page = $request->input('page');
            $pageSize = $request->input('pageSize');

            $startIndex = (($page - 1) * $pageSize) ?? 0;

            $cql = $this->buildCqlFilter($search, $organization, $status, $bbox);

            $requestData = [
                'service' => 'WFS',
                'request' => 'GetFeature',
                'version' => '2.0.0',
                'typename' => 'planojumu_teritorijas_geolatvija',
                'outputFormat' => 'application/json',
                'sortBy' => 'seciba',
                'count' => $pageSize ?? 5,
                'startIndex' => $startIndex,
                'propertyName' => $request->input('propertyName') ?? 'dok_id,dok_nosaukums,dok_status,atvk_nos,organisations_id',
            ];

            if (isset($cql) && $cql !== '') {
                $requestData['cql_filter'] = $cql;
            }

            $response = $this->tapisApi->call('/geoserver/tapis_apvienotie/wfs', $requestData);

            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function buildCqlFilter($search, $organization, $status, $bbox)
    {
        $cql = '';
        if ($search) {
            $search = $this->replaceSpecialSymbols($search);
            $searches = explode(' ', $search);

            foreach ($searches as $sea) {
                if ($cql) {
                    $cql = $cql . ' and ';
                }

                if (!trim($sea)) {
                    continue;
                }

                $cql = $cql . 'meklet like \'%' . strtolower(trim($sea)) . '%\'';
            }
        }


        if ($status) {
            if ($cql) {
                $cql = $cql . ' and ';
            }

            $cql = $cql . 'dok_status in (\'' . implode('\', \'', $status) . '\')';
        }

        if ($organization) {
            if ($cql) {
                $cql = $cql . ' and ';
            }

            $cql = $cql . 'organisations_id in (' . implode(', ', $organization) . ')';

        }

        if ($cql == '' && isset($bbox) && $bbox !== '') {
            $cql = 'INTERSECTS(the_geom,' . $bbox . ')';
        }

        return $cql;
    }

    public function getPlannedDocument($id): Response|JsonResponse
    {
        try {
            $requestData = [
                'version' => 4,
                'parent' => 'document_' . $id
            ];

            $response = $this->tapisApi->call('/rest/gis_layers/tree.json', $requestData);

            return $this->successResponse($response['document_' . $id]);
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function proposalSubmit(Request $request)
    {
        try {
            $data = $request->only([
                'address',
                'answer',
                'cadastre',
                'email',
                'geom',
                'phone',
                'placeInputType',
                'proposal',
                'user_id',
                'full_name',
                'personal_code',
                'tapisId',
            ]);
            $contactInfo = [];

            if (isset($data['email'])) {
                $contactInfo[] = $data['email'];
            }

            if (isset($data['phone'])) {
                $contactInfo[] = $data['phone'];
            }

            // Create a SimpleXMLElement
            $xml = new SimpleXMLElement('<wfs:Transaction xmlns:wfs="http://www.opengis.net/wfs"/>');
            $xml->addAttribute('service', 'WFS');
            $xml->addAttribute('version', '1.1.0');
            $xml->addAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
            $xml->addAttribute('xsi:schemaLocation', 'http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd vraa_priv.gov.lv/geoserver/vraa_priv/wfs?SERVICE=WFS&amp;VERSION=1.1.0&amp;REQUEST=DescribeFeatureType&amp;TYPENAME=vraa_priv:public_discussion_comments_geo_v');
            $xml->addAttribute('xmlns:wfs', 'http://www.opengis.net/wfs');
            $insert = $xml->addChild('wfs:Insert');

            $discusion = $insert->addChild('feature:public_discussion_comments_geo_v', '', 'vraa_priv.gov.lv');

            $discusion->addChild('feature:public_discussion_id', $data['tapisId']);
            $discusion->addChild('feature:name', $data['full_name']);
            $discusion->addChild('feature:geo_user_id', $data['user_id']);
            $discusion->addChild('feature:geo_comment_id');
            $discusion->addChild('feature:commenter_code', $data['personal_code']);
            $discusion->addChild('feature:reg_num');
            $discusion->addChild('feature:org_name');
            $discusion->addChild('feature:contact_info', implode(', ', $contactInfo) ?? null);
            $discusion->addChild('feature:address', $data['address'] ?? null);
            $discusion->addChild('feature:cadastre_designation', $data['cadastre'] ?? null);
            $discusion->addChild('feature:comment', $data['proposal']);
            $discusion->addChild('feature:additional_info');

            //add raw xml
            if (isset($data['geom']) && $data['geom']) {
                $geom = $discusion->addChild('feature:geom');
                $childDom = dom_import_simplexml($geom);
                $rawXmlDom = new DOMDocument();
                $rawXmlDom->loadXML($data['geom']);
                $rawXmlNode = $rawXmlDom->documentElement;
                $importedNode = $childDom->ownerDocument->importNode($rawXmlNode, true);

                $childDom->appendChild($importedNode);
            }

            $xmlWithoutDeclaration = trim(substr($xml->asXML(), strlen('<?xml version="1.0"?>')));

            return $this->tapisApi->call('/geoserver/vraa_priv/wfs?service=wfs&version=1.1.0&request=Transaction', [], 'POST', ["content-type" => "application/xml"], ['body' => $xmlWithoutDeclaration], true);
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function autoRedirect(Request $request, $path): Response|JsonResponse
    {
        try {
            $hasFile = ['GetMap', 'GetTile'];

            $fileCheck = $request->input('REQUEST');
            $isFile = in_array($fileCheck, $hasFile);
            $headers = [];

            if ($isFile) {
                $headers = ['Content-Type' => 'image/png'];
            }

            $response = $this->tapisApi->call('/' . $path, $request->all(), $request->getMethod(), [], [], $isFile);

            return $this->successResponse($response, 200, $headers);
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function myDiscussions(Request $request): Response|JsonResponse
    {
        try {

            $search = $request->input('commenter_code');

            $page = $request->input('page');
            $pageSize = $request->input('pageSize');

            $startIndex = (($page - 1) * $pageSize) ?? 0;

            $requestData = [
                'service' => 'WFS',
                'request' => 'GetFeature',
                'version' => '2.0.0',
                'typename' => 'vraa_priv:public_discussion_comments_geo_v',
                'outputFormat' => 'application/json',
                'sortBy' => 'created_at DESC',
                'count' => $pageSize ?? 5,
                'startIndex' => $startIndex,
                'cql_filter' => 'commenter_code = \'' . $search . '\'',
                'propertyName' => 'public_discussion_id,id,document_name,name,correspondence_address,contact_info,comment,created_at,contact_info,document_id,geom',
            ];

            $response = $this->tapisApi->call('/geoserver/vraa_priv/wfs', $requestData);

            foreach ($response['features'] as $feature) {
                if ($feature['properties']['public_discussion_id']) {
                    $requestData = ['comment_id' => $feature['properties']['id']];
                    $comment = $this->tapisApi->call('/rest/public_discussion_comment_answers', $requestData, "GET", [], ['unset-content-type' => true]);

                    if ($comment['success']) {
                        $parsed = [];

                        foreach ($comment['data'] as $test) {
                            if ($test['sent_time_to_latvija_lv']) {
                                $parsed[] = $test;
                            }
                        }

                        $comment['data'] = $parsed;

                        $feature['properties']['status'] = $comment['data'][count($comment['data']) - 1]['status'] ?? null;
                        $feature['properties']['decision'] = $comment['data'][count($comment['data']) - 1]['decision'] ?? null;
                        $feature['properties']['decision_justification'] = $comment['data'][count($comment['data']) - 1]['decision_justification'] ?? null;
                    }
                }

                $response['data'][] = $feature['properties'];
            }

            unset($response['features']);
            $response['currentPage'] = (int)$page ?? 1;
            $response['total'] = (int)$response['numberMatched'];
            $response['to'] = (int)($startIndex + $pageSize);

            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function getDiscussionAnswers(Request $request)
    {
        return $this->tapisApi->call('/rest/public_discussion_comment_answers', ['commenter_code' => $request->input('commenter_code')], "GET", [], ['unset-content-type' => true]);
    }

    public function getDiscussionAnswer($id, Request $request): Response|JsonResponse
    {


        $commenter_code = $request->input('commenter_code');

        $requestData = [
            'service' => 'WFS',
            'request' => 'GetFeature',
            'version' => '1.1.0',
            'typename' => 'vraa_priv:public_discussion_comments_geo_v',
            'outputFormat' => 'application/json',
            'cql_filter' => "id = '$id' AND commenter_code = '$commenter_code'",
            'propertyName' => 'public_discussion_id,document_name,comment,created_at,id',
        ];


        try {
            $wfsResponse = $this->tapisApi->call('/geoserver/vraa_priv/wfs', $requestData);

            $params = [
                'comment_id' => $id
            ];

            $response = $this->tapisApi->call('/rest/public_discussion_comment_answers/', $params, "GET", [], ['unset-content-type' => true]);

            $response['document_name'] = $wfsResponse['features'][0]['properties']['document_name'];
            $response['comment'] = $wfsResponse['features'][0]['properties']['comment'];
            $response['created_at'] = $wfsResponse['features'][0]['properties']['created_at'];
            //            $response['created_at'] = Carbon::parse($wfsResponse['features'][0]['properties']['created_at'])->format('Y-m-s');

            if (isset($response['data'])) {
                $parsed = [];

                foreach ($response['data'] as $test) {
                    if ($test['sent_time_to_latvija_lv']) {
                        $parsed[] = $test;
                    }
                }

                $response['data'] = $parsed;
            }

            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function getNotificationGroups(Request $request): Response|JsonResponse
    {
        try {
            $response = $this->tapisApi->call('/rest/tapis_data/notification_subscription_groups');

            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function getOrganizationsForPlannedDocuments(): Response|JsonResponse
    {
        try {
            $requestData = [
                'service' => 'WFS',
                'request' => 'GetFeature',
                'version' => '2.0.0',
                'typename' => 'organisations_geolatvija',
                'outputFormat' => 'application/json',
                'propertyName' => 'id,name',
            ];

            return $this->successResponse($this->tapisApi->call('/geoserver/tapis_apvienotie/wfs', $requestData));
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }

    }

    public function getUserNotifications($id): Response|JsonResponse
    {
        try {

            $params = [
                'UserId' => $id,
            ];

            $response = $this->tapisApi->call('/rest/user_subscription_groups/', $params);

            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function createUserNotification(Request $request): Response|JsonResponse
    {
        try {
            $data = $request->all();

            $tapisData = [
                'UserId' => $data['personal_code'],
                'NotificationSubscriptionGroupIds' => $data['notification_group_ids'] ?? $data['notification_groups'],
                'TerritoryIds' => [],
                'CustomSubscriptionTerritories' => [
                    [
                        'Name' => $data['name'],
                        'Address' => $data['address'] ?? "",
                        'Radius' => $data['radius'],
                        'CoordX' => $data['coord_l_k_s_long'],
                        'CoordY' => $data['coord_l_k_s_lat'],
                    ]
                ],
            ];

            $response = $this->tapisApi->call('/rest/user_subscription_groups/', $tapisData, "POST");

            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->errorResponse($data['personal_code'], $e->getCode());
        }
    }

    public function updateUserNotification(Request $request, $id): Response|JsonResponse
    {
        try {
            $data = $request->all();

            $tapisData = [
                'NotificationSubscriptionGroupIds' => $data['notification_group_ids'] ?? $data['notification_groups'],
                'TerritoryIds' => [],
                'CustomSubscriptionTerritories' => [
                    [
                        'Name' => $data['name'],
                        'Address' => $data['address'] ?? "",
                        'Radius' => $data['radius'],
                        'CoordX' => $data['coord_l_k_s_long'],
                        'CoordY' => $data['coord_l_k_s_lat'],
                    ]
                ],
            ];

            $response = $this->tapisApi->call('/rest/user_subscription_groups/' . $id, $tapisData, "PUT");

            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->errorResponse($id, $e->getCode());
        }
    }

    public function deleteUserNotification($id): Response|JsonResponse
    {
        try {
            $response = $this->tapisApi->call('/rest/user_subscription_groups/' . $id, [], "DELETE");

            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->errorResponse($id, $e->getCode());
        }
    }

    public function createUserInTapis(Request $request): Response|JsonResponse
    {
        try {
            $data = $request->all();

            $response = $this->tapisApi->call('/ws/create_or_update_person', $data, "POST");

            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function parcelDataEmail(Request $request): Response|JsonResponse
    {
        try {
            $data = $request->only(['cadastre_number', 'person_code']);

            $response = $this->tapisApi->call('/ws/generate_and_send_parcel_data_email', $data, "POST");

            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }
    public function createProject(Request $request): Response|JsonResponse
    {
        try {
            $data = $request->only(['project']);
            $response = $this->lbisApi->call('/projects', $data, "POST");
            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }
    public function updateProject(Request $request, $id): Response|JsonResponse
    {
        try {
            $data = $request->only(['project']);

            $response = $this->lbisApi->call('/projects/' . $id, $data, "PATCH");

            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function getProject($id, Request $request): Response|JsonResponse
    {
        try {
            $queryParams = $request->only(['search']);
            $response = $this->lbisApi->call("/projects/$id", [], "GET", [], ['type' => 'body', 'body' => json_encode($queryParams)]);
            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }


    public function getAllProjects(Request $request): Response|JsonResponse
    {
        try {
            $queryParams = $request->only(['search']);

            $response = $this->lbisApi->call("/projects", $queryParams, "GET", [], ['type' => 'body', 'body' => json_encode($queryParams)]);
            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }


    public function voteForProject(Request $request): Response|JsonResponse
    {
        try {
            $data = $request->only(['vote']);
            $response = $this->lbisApi->call('/votes', $data, "POST");
            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function getOrganisations(): Response|JsonResponse
    {
        try {
            $response = $this->lbisApi->call("/tapis/organisations", [], "GET", []);
            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }


    public function postNotificationConfig(Request $request): Response|JsonResponse
    {
        try {
            $data = $request->only(['notification_configuration']);
            $response = $this->lbisApi->call('/notification_configurations', $data, "POST");
            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function getNotificationConfig(Request $request): Response|JsonResponse
    {
        try {
            $queryParams = $request->only(['search']);
            $response = $this->lbisApi->call("/notification_configurations", $queryParams, "GET", []);
            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function getParticipationBudget($id): Response|JsonResponse
    {
        try {
            $org = $this->lbisApi->call("/tapis/participation_budgets" , ['search' => ['atvk_id' => $id, 'year' => Carbon::now()->format('Y')]], "GET", []);
            if (!isset($org[0]['id'])) {
                $this->errorResponse('Org not found', 404);
            }
            $response = $this->lbisApi->call("/tapis/participation_budgets/" . $org[0]['id'], [], "GET", []);
            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }

    public function getParticipationBudgets(Request $request): Response|JsonResponse
    {
        try {
            $queryParams = $request->only(['search']);

            $response = $this->lbisApi->call("/tapis/participation_budgets" , $queryParams, "GET", []);

            return $this->successResponse($response);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return $this->errorResponse($e->getMessage(), $e->getCode());
        }
    }
}
