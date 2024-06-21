<?php

namespace App\Http\Requests;

use App\Traits\CamelToSnakeHelper;
use Illuminate\Foundation\Http\FormRequest;

class GeoProductStoreRequest extends FormRequest
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
            'id' => [''],
            'name' => ['string', 'nullable'],
            'description' => ['nullable'],
            'regularityRenewalClassifierValueId' => ['string', 'nullable'],
            'organizationName' => ['string', 'nullable'],
            'email' => ['string', 'nullable'],
            'tags' => ['array', 'nullable'],
            'coordinateSystem' => ['nullable', 'string'],
            'services' => ['array'],
            'filesData' => ['array'],
            'others' => ['array'],
            'none' => ['array'],
            'photo' => ['nullable', 'clamav'],
            'dataSpecification' => ['nullable', 'clamav'],
            'coordinateSystemClassifierValueId' => ['nullable'],
            'scaleClassifierValueId' => ['nullable'],
            'dataReleaseDate' => ['nullable'],
            'dataUpdatedAt' => ['nullable'],
            'spatialDataClassifierValueId' => ['nullable'],
            'inspiredDataClassifierValueId' => ['nullable'],
            'keywordClassifierValueId' => ['nullable'],
            'primaryDataThemeClassifierValueId' => ['nullable'],
            'enablePrimaryDataThemeClassifier' => ['integer'],
            'accessAndUseRestrictions' => ['nullable', 'string'],
            'enableAccessAndUseRestrictions' => ['integer'],
            'accessAndUseConditions' => ['nullable', 'string'],
            'enableAccessAndUseConditions' => ['integer'],
            'inspireValidation' => [],
            'dataOrigin' => ['nullable'],
            'dynamicFiles' => ['clamav', 'nullable'],
            'isInspired' => [],
            'precision' => [],
            'completenessValue' => [],
            'toBeDeleted' => [],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'services' => $this->camelToSnakeArrayKeysDeep(json_decode($this->services, true) ?? []),
            'filesData' => $this->camelToSnakeArrayKeysDeep(json_decode($this->filesData, true) ?? []),
            'others' => $this->camelToSnakeArrayKeysDeep(json_decode($this->others, true) ?? []),
            'none' => $this->camelToSnakeArrayKeysDeep(json_decode($this->none, true) ?? []),
            'tags' => json_decode($this->tags, true) ?? [],
            'isInspired' => $this->isInspired === 'true'
        ]);

        $nullable = [
            'description',
            'regularityRenewalClassifierValueId',
            'name',
            'organizationName',
            'email',
            'tags',
            'coordinateSystem',
            'spatialDataClassifierValueId',
            'inspiredDataClassifierValueId',
            'keywordClassifierValueId',
            'primaryDataThemeClassifierValueId',
            'accessAndUseRestrictions',
            'accessAndUseConditions',
            'dataOrigin',
            'scaleClassifierValueId',
            'coordinateSystemClassifierValueId',
            'photo',
            'dataSpecification',
            'precision',
            'completenessValue',
        ];

        foreach ($nullable as $k) {
            if ($this->{$k} == 'null' || $this->{$k} == 'undefined') {
                $this->merge([
                    $k => null,
                ]);
            };
        }

    }
}
