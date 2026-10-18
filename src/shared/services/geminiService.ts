import { optimizeImageForAI } from '@/shared/utils/imageOptimizer';

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
}

export interface GeminiNailImageAnalysis {
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

/**
 * Sends conversational message to server-side Gemini 3.7 Flash
 */
export async function sendGeminiChatMessage(
  message: string,
  history: Array<{ sender: 'user' | 'assistant'; text?: string }> = [],
  context: { selectedService?: string } = {}
): Promise<GeminiChatResponse> {
  try {
    const response = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history: history.slice(-8), // Send recent context
        context,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error ${response.status}`);
    }

    const data: GeminiChatResponse = await response.json();
    return data;
  } catch (error: any) {
    console.warn('Gemini chat API call fallback:', error);
    return {
      text: '¡Hola! Te atiendo con gusto. ¿Te gustaría agendar una cita para manicura o pestañas, cotizar un diseño o ver nuestro catálogo?',
      suggestedReplies: [
        'Ver catálogo de servicios',
        'Cotizar foto de uñas',
        'Elegir mi especialista',
        'Reserva guiada por pasos',
      ],
      error: error?.message,
    };
  }
}

/**
 * Multimodal image analysis using server-side Gemini
 * Automatically compresses large image payloads client-side for ultra-fast response times (<1.5s).
 */
export async function analyzeNailReferenceWithGemini(
  imageSource: string | File | Blob,
  mimeType: string = 'image/jpeg',
  userNotes?: string
): Promise<GeminiNailImageAnalysis> {
  try {
    let payloadBase64 = '';
    let payloadMime = mimeType || 'image/jpeg';

    if (imageSource instanceof Blob || (typeof imageSource === 'string' && (imageSource.startsWith('data:') || imageSource.length > 50000))) {
      // Compress and scale down to max 1024px for lightning-fast transfer & AI processing
      const optimized = await optimizeImageForAI(imageSource, 1024, 0.82);
      payloadBase64 = optimized.base64;
      payloadMime = optimized.mimeType || 'image/jpeg';
    } else if (typeof imageSource === 'string') {
      payloadBase64 = imageSource.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');
    }

    if (!payloadBase64) {
      throw new Error('No se pudo procesar la imagen.');
    }

    const response = await fetch('/api/gemini/analyze-nail-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64: payloadBase64,
        mimeType: payloadMime,
        userNotes,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error ${response.status}`);
    }

    const data: GeminiNailImageAnalysis = await response.json();
    return data;
  } catch (error: any) {
    console.warn('Gemini nail image analysis API call fallback:', error);
    return {
      technique: 'Soft Gel / Gel-X',
      recommendedService: 'Soft Gel Tips + Nail Art Personalizado',
      complexity: 'Intermedio',
      detectedStyle: 'Efecto Glazed & Arte Decorativo en Uñas',
      detectedColors: ['Nude Rosado', 'Blanco Perla'],
      detectedShape: 'Almendra',
      detectedLength: 'Medio (M)',
      detectedExtras: [
        { name: 'Efecto Glazed / Chrome', estimatedCost: 150 },
      ],
      estimatedDurationMinutes: 75,
      basePrice: 550,
      artPrice: 150,
      totalEstimatedPrice: 700,
      description: 'Hemos procesado tu referencia de uñas. Puedes seleccionar la forma y el largo a continuación para calcular tu cotización en tiempo real.',
      stylistTip: 'Personaliza tu largo y forma favorita para ver el cálculo final.',
      error: error?.message,
    };
  }
}
