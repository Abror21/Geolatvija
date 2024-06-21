<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NotificationStoreRequest extends FormRequest
{
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
            'isPublic' => ['nullable', 'boolean'],
            'uiMenuIds' => ['required', 'array'],
            'content' => ['required', 'string'],
            'publicFrom' => ['nullable', 'date'],
            'publicTo' => ['nullable', 'date'],
        ];
    }

}
