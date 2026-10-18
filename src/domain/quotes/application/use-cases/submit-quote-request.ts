import { QuoteRequest, NailConfiguration, DesignDetails, SchedulePreference } from '../../entities/QuoteRequest';

export interface SubmitQuoteRequestInput {
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceTitle: string;
  nailConfig: NailConfiguration;
  designDetails: DesignDetails;
  referenceImages: string[];
  schedulePref: SchedulePreference;
}

export class SubmitQuoteRequestUseCase {
  public execute(input: SubmitQuoteRequestInput): QuoteRequest {
    const id = `qr-${Date.now()}`;
    return {
      id,
      clientId: input.clientId,
      clientName: input.clientName,
      serviceId: input.serviceId,
      serviceTitle: input.serviceTitle,
      nailConfig: input.nailConfig,
      designDetails: input.designDetails,
      referenceImages: input.referenceImages,
      schedulePref: input.schedulePref,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
    };
  }
}
