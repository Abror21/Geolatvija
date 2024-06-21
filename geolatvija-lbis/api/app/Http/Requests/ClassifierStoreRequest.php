<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClassifierStoreRequest extends FormRequest
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
            'uniqueCode' => ['required', 'string'],
            'enableWeights' => ['required', 'boolean']
        ];
    }

}