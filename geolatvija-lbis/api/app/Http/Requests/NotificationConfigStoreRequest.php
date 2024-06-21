<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NotificationConfigStoreRequest extends FormRequest
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
        // Add any data preparation logic if needed
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'notification_configuration' => ['required'],
            'notification_configuration.configurations' => ['required', 'array'],
            'notification_configuration.configurations.*.atvk_id' => ['', 'string'],
            'notification_configuration.configurations.*.vote_start' => ['required', 'boolean'],
            'notification_configuration.configurations.*.submit_start' => ['required', 'boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'notification_configuration.configurations.required' => 'Configurations are required.',
            'notification_configuration.configurations.*.atvk_id.required' => 'The ATVK ID is required.',
            'notification_configuration.configurations.*.vote_start.required' => 'The vote start field is required.',
            'notification_configuration.configurations.*.submit_start.required' => 'The submit start field is required.',
        ];
    }
}
