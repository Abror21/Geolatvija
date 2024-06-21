<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;

class ProjectsStoreRequest extends FormRequest
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
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        foreach (Arr::get($this?->project, 'versions_attributes') ?? [] as $key => $atribute) {
            foreach (Arr::get($atribute, 'pictures_attributes') ?? [] as $key2 => $picture) {

                $imageName = Arr::get($picture, 'attachment.filename');
                if (!empty($imageName)) {
                    $imageExtension = pathinfo($imageName, PATHINFO_EXTENSION);
                    if (!in_array($imageExtension, ['jpeg', 'png', 'jpg'])) {
                        throw new \Exception('validation.image_type_invalid');
                    }
                }

                $imageData = Arr::get($picture, 'attachment.data');
                if (!empty($imageData)) {
                    $base64_parts = explode(',', $imageData, 2);
                    if (isset($base64_parts[1])) {
                        $imgdata = base64_decode($base64_parts[1]);
                        $finfo = finfo_open(FILEINFO_MIME_TYPE);
                        $mime_type = finfo_buffer($finfo, $imgdata);
                        finfo_close($finfo);
                        if (!in_array($mime_type, ['image/jpeg', 'image/png', 'image/jpg'])) {
                            throw new \Exception('validation.image_type_invalid');
                        }
                    }
                }
                
            }
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'project' => ['required'],
            'project.name' => ['required', 'string', 'max:1000'],
            'project.atvk_id' => ['required', 'string'],
            'project.year' =>['required', 'integer'],
            'project.submitter_name' => ['required', 'string', 'max:50'],
            'project.submitter_last_name' => ['required', 'string', 'max:50'],
            'project.versions_attributes.*.the_geom' => ['required', 'string'],
            'project.versions_attributes.*.indicative_costs' => ['required', 'integer', 'digits_between:1,10'],
            'project.versions_attributes.*.concept_description' => ['required', 'string', 'max:3000'],
            'project.versions_attributes.*.partial_implementation_flag' => ['nullable', 'boolean'],
            'project.versions_attributes.*.submitter_phone' => ['nullable', 'string', 'digits_between:1,12'],
            'project.versions_attributes.*.submitter_email' => ['nullable', 'string', 'max:100'],
            'project.versions_attributes.*.submitter_is_organisation' => ['required', 'boolean'],
            'project.versions_attributes.*.organisation_name' => ['nullable', 'string', 'max:1000'],
            'project.versions_attributes.*.organisation_registration_number' => ['nullable', 'integer', 'digits_between:1,12'],
            'project.versions_attributes.*.notes_for_specialist' => ['nullable', 'string'],
            'project.versions_attributes.*.required_attachments_attributes.*.position' => ['required', 'integer'],
            'project.versions_attributes.*.required_attachments_attributes.*.id' => ['nullable', 'integer'],
            'project.versions_attributes.*.required_attachments_attributes.*.section_name' => ['nullable', 'string'],
            'project.versions_attributes.*.pictures_attributes.*.position' => ['required', 'integer'],
            'project.versions_attributes.*.pictures_attributes.*.id' => ['nullable', 'integer'],
            'project.versions_attributes.*.pictures_attributes.*.section_name' => ['nullable', 'string'],
        ];
    }
}
