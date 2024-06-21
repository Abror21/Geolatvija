<?php

namespace App\Http\Requests;

use App\Enums\UnificationType;
use App\Traits\CamelToSnakeHelper;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class BackgroundTaskStoreRequest extends FormRequest
{
    use CamelToSnakeHelper;

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string'],
            'isActive' => ['required'],
            'cron' => ['required'],
            'description' => ['nullable'],
        ];
    }
}
