<?php

namespace App\Imports;

use App\Models\UserEmbeds;
use App\Repositories\UserRepository;
use App\Services\UserEmbedService;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class EmbedImport implements ToModel, WithHeadingRow
{
    public function __construct(
        private UserRepository $userRepository,
        private UserEmbedService $userEmbedService,
    )
    {
    }

    /**
     * @param array $row
     * @return UserEmbeds|void|null
     */
    public function model(array $row)
    {
        if ($row['expire_date'] != "NULL") {
            return null;
        }

        $user = $this->userRepository->findEmbedUser($row['pid'], $row['registrationnumber']);

        Log::info('started ' . $row["mapitem_key"]);

        if (!json_validate($row["mapitem_data"])) {
            return;
        }

        $data = [
            'width' => json_decode($row["mapitem_data"], true)['app']['size']['width'] ?? 425,
            'height' =>  json_decode($row["mapitem_data"], true)['app']['size']['height'] ?? 300,
            'uuid' => $row["mapitem_key"],
        ];

        $iframe = $this->userEmbedService->generateIframe($data);

        return new UserEmbeds([
            'uuid' => $row["mapitem_key"],
            'name' => $row["mapitem_name"],
            'pid' => $row["pid"],
            'data' => $row["mapitem_data"],
            'domain' => $row["app_domain"],
            'width' => json_decode($row["mapitem_data"], true)['app']['size']['width'] ?? 425,
            'height' =>  json_decode($row["mapitem_data"], true)['app']['size']['height'] ?? 300,
            'size_type' => "MEDIUM",
            'reg_nr' => $row['registrationnumber'] != "NULL" ? $row['registrationnumber'] : null,
            'role_id' => $user ? $user->role_id : null,
            'iframe' => $iframe
        ]);
    }
}
