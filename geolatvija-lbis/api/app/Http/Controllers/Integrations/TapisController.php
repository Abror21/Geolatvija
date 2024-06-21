<?php

namespace App\Http\Controllers\Integrations;


use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectsStoreRequest;
use App\Http\Requests\VoteForProjectRequest;
use App\Http\Requests\NotificationConfigStoreRequest;
use App\Repositories\PublicDiscussionCommentAnswerRepository;
use App\Repositories\RoleRepository;
use App\Services\API\APIOuterAPI;
use App\Services\SystemSettingService;
use App\Traits\CaptchaValidationHelper;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;


class TapisController extends Controller
{
    use CaptchaValidationHelper;


    public function __construct(
        private readonly APIOuterAPI $APIOuterAPI,
        private readonly RoleRepository $roleRepository,
        private readonly SystemSettingService $systemSettingService,
        private readonly PublicDiscussionCommentAnswerRepository $publicDiscussionCommentAnswerRepository,
    )
    {
        $this->headers = ['X-GEO-HTTP-SECRET' => config('geo.api_outer_service_token')];
    }

    /**
     * @description Get Planned Documents from Tapis
     */
    public function getPlannedDocuments(Request $request): Response|JsonResponse
    {
        $response = $this->APIOuterAPI->call('api/v1/tapis/planned-documents', $request->all(), "GET", $this->headers);

        return $this->successResponse($response);
    }

    /**
     * @description Get Planned Documents from Tapis without Captcha
     */
    public function getPlannedDocumentsWithoutCaptcha(Request $request): Response|JsonResponse
    {
        $response = $this->APIOuterAPI->call('api/v1/tapis/planned-documents', $request->all(), "GET", $this->headers);

        return $this->successResponse($response);
    }

    /**
     * @description Get Planned Document from Tapis
     */
    public function getPlannedDocument(Request $request, $id): Response|JsonResponse
    {
        $response = $this->APIOuterAPI->call('api/v1/tapis/planned-documents/' . $id, $request->all(), "GET", $this->headers);

        return $this->successResponse($response);
    }

    /**
     * @description Get Planned Documents Organizations from Tapis
     */
    public function getPlannedDocumentsOrganizations(Request $request): Response|JsonResponse
    {
        $response = $this->APIOuterAPI->call('api/v1/tapis/organizations', $request->all(), "GET", $this->headers);

        return $this->successResponse($response);
    }

    /**
     * @description Submit Proposal to Tapis
     */
    public function proposalSubmit(Request $request): Response|JsonResponse
    {
        $data = $request->all();

        $activeRole = $this->roleRepository->activeRole();

        $physicalPerson = $activeRole->userGroup->code == 'authenticated';

        if (!$physicalPerson) {
            throw new \Exception('validation.only_physical_person_allowed');
        }

        $user = $activeRole->user;

        $data['user_id'] = $activeRole->user_id;
        $data['personal_code'] = $user->personal_code;
        $data['full_name'] = $user->name . ' ' . $user->surname;

        $response = $this->APIOuterAPI->call('api/v1/tapis/proposal-submit', $data, "POST", $this->headers);

        return $this->successResponse($response);
    }

    /**
     * @description Tapis Auto redirect
     */
    public function autoRedirect(Request $request, $path): Response|JsonResponse
    {
        $hasFile = ['GetMap', 'GetTile'];

        $fileCheck = $request->input('REQUEST');
        $isFile = in_array($fileCheck, $hasFile);
        $headers = [];

        if ($isFile) {
            $headers = ['Content-Type' => 'image/png'];
        }

        $response = $this->APIOuterAPI->call('api/v1/tapis/geoserver/' . $path, $request->all(), $request->getMethod(), $this->headers, [], $isFile);

        return $this->successResponse($response, 200, $headers);
    }

    /**
     * @description Get my(User) Discussions from Tapis
     */
    public function myDiscussions(Request $request): Response|JsonResponse
    {
        $all = $request->all();
        $all['commenter_code'] = $request->user()->user->personal_code;

        $response = $this->APIOuterAPI->call('api/v1/tapis/my-discussions', $all, "GET", $this->headers);

        $ids = collect($response['data'])->pluck('id');

        $innerDiscussions = $this->publicDiscussionCommentAnswerRepository->getDiscussions($ids);

        foreach ($response['data'] as &$discussion) {
            $hasDiscussions = $innerDiscussions->where('comment_id', $discussion['id'])->count();

            $discussion['has_unseen'] = !!$hasDiscussions;
        }


        return $this->successResponse($response);
    }

    /**
     * @description Get Discussion answer from Tapis
     */
    public function getDiscussionAnswer($id, Request $request): Response|JsonResponse
    {
        $data = [
            'commenter_code' => $request->user()->user->personal_code
        ];

        $response = $this->APIOuterAPI->call('api/v1/tapis/get-discussion-answer/' . $id, $data, "GET", $this->headers);

        if (isset($response['data'][0]['comment_id'])) {
            $response['has_seen'] = $this->publicDiscussionCommentAnswerRepository->makeRead($response['data'][0]['comment_id']);
        }

        return $this->successResponse($response);
    }

    /**
     * @description Post Parcel Data Email to Tapis
     */
    public function parcelDataEmail(Request $request): Response|JsonResponse
    {
        $data = [
            'person_code' => $request->user()->user->personal_code,
            'cadastre_number' => $request->input('cadastreNumber'),
        ];

        $response = $this->APIOuterAPI->call('api/v1/tapis/ws/generate_and_send_parcel_data_email', $data, "POST", $this->headers);

        return $this->successResponse($response);
    }

    /**
     * @description Post Project Data Tapis
     */
    public function createProject(ProjectsStoreRequest $request): Response|JsonResponse
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());
        $options['project']['submitter_code'] = $request->user()->user->personal_code;
        $response = $this->APIOuterAPI->call('api/v1/tapis/projects', $options, "POST", $this->headers);
        return $this->successResponse($response);
    }

    /**
     * @description Post Project Data Tapis
     */
    public function updateProject($id, ProjectsStoreRequest $request): Response|JsonResponse
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());
        $response = $this->APIOuterAPI->call('api/v1/tapis/projects/' . $id, $options, "PATCH", $this->headers);
        return $this->successResponse($response);
    }

    public function getProject($id, Request $request): Response|JsonResponse
    {
        $queryParams = $request->only(['search']);
        $queryParams['search']['check_vote_code'] = auth('sanctum')->user()->user->personal_code ?? null;
        $response = $this->APIOuterAPI->call('api/v1/tapis/projects/' . $id, $queryParams, "GET", $this->headers);
        return $this->successResponse($response);
    }

    /**
     * @description Get all projects from Tapis
     */
    public function getAllProjects(Request $request): Response|JsonResponse
    {
        $queryParams = $request->only(['search']);
        $queryParams['search']['check_vote_code'] = auth('sanctum')->user()->user->personal_code ?? null;

        if (isset($queryParams['search']['submitter_code'])) {
            $queryParams['search']['submitter_code'] = auth('sanctum')->user()->user->personal_code ?? null;
        }

        if (isset($queryParams['search']['voter_code'])) {
            $queryParams['search']['voter_code'] = auth('sanctum')->user()->user->personal_code ?? null;
        }

        $response = $this->APIOuterAPI->call('api/v1/tapis/projects/', $queryParams, "GET", $this->headers);
        return $this->successResponse($response);
    }

    /**
     * @description Post Votion for Project Tapis
     */
    public function voteForProject(VoteForProjectRequest $request): Response|JsonResponse
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());
        $options['vote']['voter_code'] = $request->user()->user->personal_code;
        $response = $this->APIOuterAPI->call('api/v1/tapis/votes', $options, "POST", $this->headers);
        return $this->successResponse($response);
    }

    public function getOrganisations(): Response|JsonResponse
    {
        $response = $this->APIOuterAPI->call('api/v1/tapis/organisations/', [], "GET", $this->headers);
        return $this->successResponse($response);
    }


    public function postNotificationConfig(NotificationConfigStoreRequest $request): Response|JsonResponse
    {
        $options = $this->camelToSnakeArrayKeys($request->validated());
        $person_code = auth('sanctum')->user()->user->personal_code ?? null;
        $options['notification_configuration']['person_code'] = $person_code;
        $response = $this->APIOuterAPI->call('api/v1/tapis/notification_configurations/', $options, "POST", $this->headers);
        return $this->successResponse($response);
    }


    public function getNotificationConfig(Request $request): Response|JsonResponse
    {
        $queryParams = $request->only(['search']);
        $queryParams['search']['person_code'] = auth('sanctum')->user()->user->personal_code ?? null;
        $response = $this->APIOuterAPI->call('api/v1/tapis/notification_configurations/', $queryParams, "GET", $this->headers);
        return $this->successResponse($response);
    }

    public function getParticipationBudget($id): Response|JsonResponse
    {
        $response = $this->APIOuterAPI->call('api/v1/tapis/participation_budgets/' . $id, [], "GET", $this->headers);
        return $this->successResponse($response);
    }

    public function getParticipationBudgets(Request $request): Response|JsonResponse
    {
        $response = $this->APIOuterAPI->call('api/v1/tapis/participation_budgets', $request->only(['search']), "GET", $this->headers);

        foreach ($response as &$budget) {
            $from = Carbon::parse($budget['submission_period_from']);
            $to = Carbon::parse($budget['submission_period_to']);
            $budget['submit_available'] = Carbon::now()->between($from, $to);
        }

        return $this->successResponse($response);
    }
}
