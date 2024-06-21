<?php

namespace App\Http\Requests\Amk;

use Illuminate\Foundation\Http\FormRequest;

class AddressStuctRequest extends FormRequest
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
            'search' => 'string|required',
            'lks_x' => 'string',
            'lks_y' => 'string',
            'limit' => 'numeric',
            'type' => 'string',

        ];
    }

}
