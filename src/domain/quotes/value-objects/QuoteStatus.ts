export type QuoteStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'NEEDS_INFORMATION'
  | 'UNDER_REVIEW'
  | 'SENT_TO_CLIENT'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'EXPIRED'
  | 'CANCELED';

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, { label: string; color: string; bg: string }> = {
  DRAFT: { label: 'Borrador', color: 'text-neutral-600', bg: 'bg-neutral-100' },
  SUBMITTED: { label: 'Enviada a Revisión', color: 'text-primary', bg: 'bg-primary/10' },
  NEEDS_INFORMATION: { label: 'Requiere Información', color: 'text-[#845E1B]', bg: 'bg-[#FAF5EC]' },
  UNDER_REVIEW: { label: 'En Evaluación por Especialista', color: 'text-primary', bg: 'bg-primary/10' },
  SENT_TO_CLIENT: { label: 'Cotización Oficial Lista', color: 'text-[#1D1D1F]', bg: 'bg-neutral-100' },
  ACCEPTED: { label: 'Aceptada por Cliente', color: 'text-primary', bg: 'bg-primary/10' },
  DECLINED: { label: 'Rechazada', color: 'text-neutral-500', bg: 'bg-neutral-100' },
  EXPIRED: { label: 'Expirada', color: 'text-neutral-400', bg: 'bg-neutral-100' },
  CANCELED: { label: 'Cancelada', color: 'text-rose-700', bg: 'bg-rose-50' },
};
