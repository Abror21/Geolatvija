import { useIntl } from 'react-intl';
import { Rule } from 'rc-field-form/lib/interface';

function useFormValidation() {
  const intl = useIntl();

  const handleValidations = (validation: string): Rule => {
    switch (validation) {
      case 'required':
        return { required: true, message: intl.formatMessage({ id: 'validation.required' }) };
      case 'regNr':
        return { pattern: /^\d{11}$/, message: intl.formatMessage({ id: 'validation.reg_nr' }) };
      case 'personalCode':
        return { pattern: /^\d{11}$/, message: intl.formatMessage({ id: 'validation.personal_code' }) };
      case 'email':
        return {
          pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
          message: intl.formatMessage({ id: 'validation.email_not_valid' }),
        };
      case 'phoneNumber':
        return { pattern: /^[+]?[0-9]+$/, message: intl.formatMessage({ id: 'validation.phone_number_not_valid' }) };
      case 'none':
        return { required: false };
      case 'requiredRichText':
        return {
          validator: (_, value) => {
            if (value?.length === 0 || value === '<p><br></p>' || value === null || value === undefined) {
              return Promise.reject(new Error(intl.formatMessage({ id: 'validation.required' })));
            }
            return Promise.resolve();
          },
        };
    }

    return {};
  };

  const formValidations = (validations: string[] | string) => {
    if (typeof validations === 'string') {
      return [handleValidations(validations)];
    }

    return validations.map(handleValidations);
  };

  return { formValidations };
}

export default useFormValidation;
