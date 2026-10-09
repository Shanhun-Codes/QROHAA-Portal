import { AgentUpdateRequest } from '../../auth/auth.model';

export interface AgentProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  realEstateLicenseNumber: string;
  headline: string;
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
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export function toAgentUpdateRequest(
  values: AgentProfileFormValues,
  formMode: 'BRANDING' | 'BROKERAGE' | 'PROFILE',
): AgentUpdateRequest {
  if (formMode === 'PROFILE') {
    return {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      realEstateLicenseNumber: values.realEstateLicenseNumber.trim(),
      ...(values.headline.trim() ? { headline: values.headline.trim() } : {}),
    };
  }

  if (formMode === 'BRANDING') {
    return {
      ...(values.primaryColor.trim()
        ? { primaryColor: values.primaryColor.trim() }
        : {}),
      ...(values.secondaryColor.trim()
        ? { secondaryColor: values.secondaryColor.trim() }
        : {}),
      ...(values.accentColor.trim()
        ? { accentColor: values.accentColor.trim() }
        : {}),
    };
  }

  const brokerage: NonNullable<AgentUpdateRequest['brokerage']> = {};
  const name = values.brokerageName.trim();
  const licenseNumber = values.brokerageLicenseNumber.trim();
  const phone = values.brokeragePhone.trim();
  const email = values.brokerageEmail.trim();
  const websiteUrl = values.brokerageWebsiteUrl.trim();
  const address = {
    ...(values.brokerageStreet.trim()
      ? { street: values.brokerageStreet.trim() }
      : {}),
    ...(values.brokerageStreet2.trim()
      ? { street2: values.brokerageStreet2.trim() }
      : {}),
    ...(values.brokerageCity.trim()
      ? { city: values.brokerageCity.trim() }
      : {}),
    ...(values.brokerageState.trim()
      ? { state: values.brokerageState.trim() }
      : {}),
    ...(values.brokerageZip.trim() ? { zip: values.brokerageZip.trim() } : {}),
  };

  if (name) brokerage.name = name;
  if (licenseNumber) brokerage.licenseNumber = licenseNumber;
  if (phone) brokerage.phone = phone;
  if (email) brokerage.email = email;
  if (websiteUrl) brokerage.websiteUrl = websiteUrl;
  if (Object.keys(address).length) brokerage.address = address;

  return { brokerage };
}
