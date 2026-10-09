export interface AgentSetupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  realEstateLicenseNumber: string;
  brokerageName: string;
  brokerageLicenseNumber: string;
  brokerageStreet: string;
  brokerageStreet2: string;
  brokerageCity: string;
  brokerageState: string;
  brokerageZip: string;
  brokeragePhone: string;
  brokerageEmail: string;
  brokerageWebsiteUrl: string;
  headline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export interface AgentSetupRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  realEstateLicenseNumber: string;
  brokerage: {
    name: string;
    licenseNumber: string;
    address: {
      street: string;
      street2?: string;
      city: string;
      state: string;
      zip: string;
    };
    phone?: string;
    email?: string;
    websiteUrl?: string;
  };
  headline?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export function toAgentSetupRequest(
  values: AgentSetupFormValues,
): AgentSetupRequest {
  const request: AgentSetupRequest = {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    realEstateLicenseNumber: values.realEstateLicenseNumber.trim(),
    brokerage: {
      name: values.brokerageName.trim(),
      licenseNumber: values.brokerageLicenseNumber.trim(),
      address: {
        street: values.brokerageStreet.trim(),
        city: values.brokerageCity.trim(),
        state: values.brokerageState.trim(),
        zip: values.brokerageZip.trim(),
      },
    },
  };

  const street2 = values.brokerageStreet2.trim();
  const brokeragePhone = values.brokeragePhone.trim();
  const brokerageEmail = values.brokerageEmail.trim();
  const brokerageWebsiteUrl = values.brokerageWebsiteUrl.trim();
  const headline = values.headline.trim();
  const primaryColor = values.primaryColor.trim();
  const secondaryColor = values.secondaryColor.trim();
  const accentColor = values.accentColor.trim();

  if (street2) request.brokerage.address.street2 = street2;
  if (brokeragePhone) request.brokerage.phone = brokeragePhone;
  if (brokerageEmail) request.brokerage.email = brokerageEmail;
  if (brokerageWebsiteUrl) request.brokerage.websiteUrl = brokerageWebsiteUrl;
  if (headline) request.headline = headline;
  if (primaryColor) request.primaryColor = primaryColor;
  if (secondaryColor) request.secondaryColor = secondaryColor;
  if (accentColor) request.accentColor = accentColor;

  return request;
}
