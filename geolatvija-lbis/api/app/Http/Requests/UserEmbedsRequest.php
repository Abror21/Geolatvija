<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserEmbedsRequest extends FormRequest
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
            'name' => ['required', 'string'],
            'domain' => ['required', 'string'],
            'width' => ['required', 'integer'],
            'height' => ['required', 'integer'],
            'sizeType' => ['required'],
            'iframe' => [],
            'temp' => [],
            'uuid' => [],
            'data' => [],
        ];
    }

}
