import { createDemoChatResponse, createDemoNailAnalysis } from './demoFixtures';

export interface GeminiChatResponse {
  text: string;
  suggestedReplies: string[];
  widgetType?:
    | 'catalog'
    | 'staff'
    | 'booking_flow'
    | 'wizard_flow'
    | 'proposal_appointment'
    | 'secure_deposit'
    | 'confirmed_pass'
    | 'loyalty'
    | 'style_advisor'
    | 'aftercare'
    | 'photo_quote'
    | 'nail_quote_customizer'
    | 'lash_selector';
  error?: string;
}

export interface GeminiNailExtra {
  name: string;
  estimatedCost: number;
  quantity?: number;
}

export interface GeminiNailImageAnalysis {
  fallback?: boolean;
  nailsDetected?: boolean;
  rejectionReason?: string;
  technique: string;
  recommendedService: string;
  complexity: 'Básico' | 'Intermedio' | 'Avanzado' | 'Master 3D';
  detectedStyle: string;
  detectedColors: string[];
  detectedShape: 'Almendra' | 'Cuadrada' | 'Coffin' | 'Stiletto' | 'Ovalada' | 'Natural';
  detectedLength: 'Corto (S)' | 'Medio (M)' | 'Largo (L)' | 'Extra Largo (XL)';
  detectedExtras: GeminiNailExtra[];
  estimatedDurationMinutes: number;
  basePrice: number;
  artPrice: number;
  totalEstimatedPrice: number;
  description: string;
  stylistTip: string;
  error?: string;
}

/** Fixture conversacional local para usar la interfaz sin backend. */
export async function sendGeminiChatMessage(
  message: string,
  history: Array<{ sender: 'user' | 'assistant'; text?: string }> = [],
  context: { selectedService?: string } = {}
): Promise<GeminiChatResponse> {
  void history;
  await new Promise<void>((resolve) => setTimeout(resolve, 350));
  return createDemoChatResponse(message, context.selectedService);
}

/** Fixture local de cotización; imageSource se conserva para compatibilidad con los callers. */
export async function analyzeNailReferenceWithGemini(
  imageSource: string | File | Blob,
  mimeType: string = 'image/jpeg',
  userNotes?: string
): Promise<GeminiNailImageAnalysis> {
  void imageSource;
  void mimeType;
  await new Promise<void>((resolve) => setTimeout(resolve, 700));
  return createDemoNailAnalysis(userNotes, true);
}

/** Fixture local para cotizar una descripción sin consultar endpoints. */
export async function analyzeNailDescriptionWithGemini(description: string): Promise<GeminiNailImageAnalysis> {
  await new Promise<void>((resolve) => setTimeout(resolve, 500));
  return createDemoNailAnalysis(description, false);
}

export function validateGeminiNailImageAnalysis(value: unknown): GeminiNailImageAnalysis {
  if (!value || typeof value !== 'object') throw new Error('La respuesta de la cotización no tiene el formato esperado.');
  const result = value as Partial<GeminiNailImageAnalysis>;
  const shapes = ['Almendra', 'Cuadrada', 'Coffin', 'Stiletto', 'Ovalada', 'Natural'];
  const lengths = ['Corto (S)', 'Medio (M)', 'Largo (L)', 'Extra Largo (XL)'];
  if (
    typeof result.technique !== 'string' ||
    typeof result.recommendedService !== 'string' ||
    !shapes.includes(result.detectedShape || '') ||
    !lengths.includes(result.detectedLength || '') ||
    !Array.isArray(result.detectedExtras) ||
    !Array.isArray(result.detectedColors) ||
    !Number.isFinite(result.estimatedDurationMinutes) ||
    !Number.isFinite(result.basePrice)
  ) throw new Error('La respuesta de la cotización llegó incompleta. Puedes editar el estimado a mano.');
  if (result.detectedExtras.some((item) => !item || typeof item.name !== 'string' || (!Number.isFinite(item.quantity) && !Number.isFinite(item.estimatedCost)))) {
    throw new Error('No pudimos validar los detalles del diseño. Puedes editarlo manualmente.');
  }
  return result as GeminiNailImageAnalysis;
}
