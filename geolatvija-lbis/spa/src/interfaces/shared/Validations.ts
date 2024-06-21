type ValidationsType = 'required' | 'regNr' | 'personalCode' | 'email' | 'none' | 'phoneNumber' | 'requiredRichText';

export interface Validations {
  validations?: ValidationsType[] | ValidationsType;
}
