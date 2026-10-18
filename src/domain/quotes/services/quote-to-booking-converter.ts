// Domain Service: Quote-to-Booking Converter
// Connects the final quote specification into a booking-ready service configuration

import { Quote } from '../entities/QuoteRequest';
import { TargetNailDesign, RequiredWorkItem } from '../entities/NailTransformationDelta';

export interface BookingReadyServicePayload {
  bookingId: string;
  quoteId: string;
  clientId: string;
  salonId: string;
  assignedArtistId?: string;
  assignedArtistName?: string;
  serviceTitle: string;
  technicalSummary: string;
  shape: string;
  length: string;
  finish: string;
  colorName: string;
  colorHex: string;
  artTier: string;
  totalDurationMinutes: number;
  totalPriceMXN: number;
  requiredDepositMXN: number;
  workItems: RequiredWorkItem[];
  expirationDate: string;
  createdAt: string;
  status: 'READY_FOR_CALENDAR' | 'DEPOSIT_PENDING' | 'CONFIRMED';
}

export class QuoteToBookingConverter {
  public static convertToBooking(
    quote: Partial<Quote>,
    target: TargetNailDesign,
    workItems: RequiredWorkItem[],
    clientId = 'client_guest_01',
    salonId = 'salon_emme_polanco'
  ): BookingReadyServicePayload {
    const totalMinutes = workItems.reduce((acc, w) => acc + w.estimatedMinutes, 0) || quote.estimatedDurationMinutes || 90;
    const totalPrice = quote.totalPrice || workItems.reduce((acc, w) => acc + w.estimatedPrice, 0) || 680;
    const deposit = quote.requiredDeposit || Math.round(totalPrice * 0.3);

    const now = new Date();
    const expiry = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 hours quote lock

    return {
      bookingId: `bk_${Date.now()}`,
      quoteId: quote.id || `quote_${Date.now()}`,
      clientId,
      salonId,
      assignedArtistId: quote.staffId,
      assignedArtistName: quote.staffName,
      serviceTitle: `Set Personalizado Emme: ${target.baseServiceCategory} (${target.lengthCategory})`,
      technicalSummary: `${target.shape.toUpperCase()} | ${target.finish.toUpperCase()} | ${target.artTier.toUpperCase()} | Tono ${target.dominantColorName}`,
      shape: target.shape,
      length: target.lengthCategory,
      finish: target.finish,
      colorName: target.dominantColorName,
      colorHex: target.dominantColorHex,
      artTier: target.artTier,
      totalDurationMinutes: totalMinutes,
      totalPriceMXN: totalPrice,
      requiredDepositMXN: deposit,
      workItems,
      expirationDate: expiry.toISOString(),
      createdAt: now.toISOString(),
      status: 'READY_FOR_CALENDAR',
    };
  }
}
