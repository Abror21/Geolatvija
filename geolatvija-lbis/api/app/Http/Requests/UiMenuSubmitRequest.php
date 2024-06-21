<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UiMenuSubmitRequest extends FormRequest
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
            'translation' => ['required', 'string'],
            'isPublic' => ['required', 'boolean'],
            'isFooter' => ['required', 'boolean'],
            'content' => ['nullable', 'string'],
            'uniqueKey' => ['nullable', 'string'],
            'sequence' => ['nullable', 'integer'],
            'description' => ['nullable', 'string'],
            'parentId' => ['nullable', 'integer'],
        ];
    }

}
