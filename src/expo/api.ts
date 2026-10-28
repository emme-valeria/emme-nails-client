import type { GeminiChatResponse, GeminiNailImageAnalysis } from '../shared/services/geminiService';
import { createDemoChatResponse, createDemoNailAnalysis } from '../shared/services/demoFixtures';

const fixtureDelay = (duration: number, signal?: AbortSignal) => new Promise<void>((resolve, reject) => {
  const abort = () => {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abort);
    reject(new Error('Solicitud cancelada'));
  };
  const timer = setTimeout(() => { signal?.removeEventListener('abort', abort); resolve(); }, duration);
  if (signal?.aborted) abort();
  else signal?.addEventListener('abort', abort, { once: true });
});

/** Fixture local del chat; conserva su interfaz, pero no conecta con el servidor. */
export async function sendExpoChatMessage(
  message: string,
  _history: Array<{ sender: 'user' | 'assistant'; text?: string }>,
  selectedService?: string,
  options?: { onChunk?: (chunk: string) => void; signal?: AbortSignal },
): Promise<GeminiChatResponse> {
  await fixtureDelay(350, options?.signal);
  const response = createDemoChatResponse(message, selectedService);
  // Local fixture transport, not a remote streaming endpoint. Existing callers
  // without a chunk listener keep the original whole-response behaviour.
  if (options?.onChunk) {
    for (let offset = 0; offset < response.text.length; offset += 32) {
      await fixtureDelay(90, options.signal);
      options.onChunk(response.text.slice(offset, offset + 32));
    }
  }
  return response;
}

/** Cotización local de muestra para probar el flujo completo sin endpoints. */
export async function analyzeExpoNailImage(
  _imageBase64: string,
  _mimeType = 'image/jpeg',
  userNotes?: string,
): Promise<GeminiNailImageAnalysis> {
  await fixtureDelay(700);
  return createDemoNailAnalysis(userNotes, true);
}
