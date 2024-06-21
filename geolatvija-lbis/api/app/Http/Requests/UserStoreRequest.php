<?php

namespace App\Http\Requests;

use App\Traits\CamelToSnakeHelper;
use Illuminate\Foundation\Http\FormRequest;

class UserStoreRequest extends FormRequest
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
            'surname' => ['required', 'string'],
            'regNr' => ['string'],
            'personalCode' => ['string'],
            'statusClassifierValueId' => [],
            'institutions' => [],
            'activeTill' => [],
            'userType' => [],
            'personalCodeRegNr' => [],
            'roles' => [],
            'emails' => [],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'roles' => $this->camelToSnakeArrayKeysDeep($this->roles),
        ]);
    }
}
