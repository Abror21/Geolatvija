<?php

namespace App\Http\Requests;

use App\Traits\CamelToSnakeHelper;
use Illuminate\Foundation\Http\FormRequest;

class PaginationRequest extends FormRequest
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
            'page' => ['required', 'integer'],
            'pageSize' => ['required', 'integer'],
            'searchOptions' => ['nullable', 'string'],
            'sortBy' => ['nullable', 'string'],
            'orderBy' => ['nullable', 'string'],
            'options' => ['nullable', 'array'],
            "filter" => ["nullable"],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'filter' => $this->camelToSnakeArrayKeys(json_decode($this->filter, true) ?? []),
        ]);
    }
}
