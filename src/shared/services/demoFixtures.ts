import type { GeminiChatResponse, GeminiNailImageAnalysis } from './geminiService';

/** Respuestas locales deterministas para desarrollar la interfaz sin backend. */
export function createDemoNailAnalysis(notes = '', imageProvided = true): GeminiNailImageAnalysis {
  const normalized = notes.toLowerCase();
  const detectedShape: GeminiNailImageAnalysis['detectedShape'] = normalized.includes('cuadrad')
    ? 'Cuadrada'
    : normalized.includes('coffin') || normalized.includes('bailarina')
      ? 'Coffin'
      : normalized.includes('stiletto')
        ? 'Stiletto'
        : normalized.includes('oval')
          ? 'Ovalada'
          : normalized.includes('natural')
            ? 'Natural'
            : 'Almendra';
  const detectedLength: GeminiNailImageAnalysis['detectedLength'] = normalized.includes('extra largo') || normalized.includes('xl')
    ? 'Extra Largo (XL)'
    : normalized.includes('largo')
      ? 'Largo (L)'
      : normalized.includes('corto')
        ? 'Corto (S)'
        : 'Medio (M)';
  const isAdvanced = /3d|cristal|relieve|escultural/.test(normalized);
  const complexity: GeminiNailImageAnalysis['complexity'] = isAdvanced ? 'Avanzado' : 'Intermedio';
  const detectedColors = [
    ...(normalized.includes('rosa') || normalized.includes('pink') ? ['Rosa'] : []),
    ...(normalized.includes('nude') || normalized.includes('natural') ? ['Nude'] : []),
    ...(normalized.includes('blanco') || normalized.includes('francesa') ? ['Blanco'] : []),
    ...(normalized.includes('negro') ? ['Negro'] : []),
    ...(normalized.includes('rojo') ? ['Rojo'] : []),
  ];
  const basePrice = 550;
  const artPrice = isAdvanced ? 280 : /francesa|glitter/.test(normalized) ? 180 : 120;

  return {
    fallback: true,
    nailsDetected: imageProvided || /uña|unas|uñas|manicura|nail/.test(normalized),
    rejectionReason: imageProvided ? '' : 'Describe un diseño de uñas para generar una estimación de muestra.',
    technique: /gel-x|soft gel/.test(normalized) ? 'Soft Gel / Gel-X' : 'Manicura y Nail Art',
    recommendedService: isAdvanced ? 'Soft Gel + Nail Art Avanzado' : 'Manicura + Nail Art Personalizado',
    complexity,
    detectedStyle: notes.trim() || 'Diseño personalizado de uñas',
    detectedColors: detectedColors.length ? detectedColors : ['Rosa suave', 'Nude'],
    detectedShape,
    detectedLength,
    detectedExtras: normalized.includes('glitter') ? [{ name: 'Acabado glitter', estimatedCost: 80, quantity: 10 }] : [],
    estimatedDurationMinutes: isAdvanced ? 105 : 75,
    basePrice,
    artPrice,
    totalEstimatedPrice: basePrice + artPrice,
    description: 'Estimación de demostración basada en la referencia y tus preferencias.',
    stylistTip: 'Puedes ajustar forma y largo antes de reservar; el precio final se confirma en el estudio.',
    error: 'Modo fixtures: no se consultó un endpoint de IA.',
  };
}

export function createDemoChatResponse(message: string, selectedService?: string): GeminiChatResponse {
  const normalized = message.toLowerCase();
  if (/ver diseños|explorar diseños|inspiración|inspiracion/.test(normalized)) {
    return {
      text: 'Explora nuestra selección de técnicas y acabados. Cuando encuentres uno que te guste, podemos ver sus detalles y reservarlo.',
      suggestedReplies: ['Ver diseños de uñas', 'Cotizar una foto', 'Agendar una cita'],
      widgetType: 'catalog',
      error: 'Modo fixtures: respuesta local de demostración.',
    };
  }
  if (/precio|catálogo|catalogo|servicio|servicios/.test(normalized)) {
    return {
      text: selectedService
        ? `Puedo orientarte sobre **${selectedService}**. El precio final depende de la técnica y el diseño.`
        : 'Tenemos Manicura Rusa, Soft Gel / Gel-X, Nail Art y Pedicura Spa. ¿Qué servicio quieres conocer?',
      suggestedReplies: ['Cotizar un diseño', 'Agendar una cita', 'Ver servicios'],
      widgetType: 'catalog',
      error: 'Modo fixtures: respuesta local de demostración.',
    };
  }
  if (/cita|agendar|reserv/.test(normalized)) {
    return {
      text: '¡Claro! Elige un servicio, el día y el horario que prefieras para preparar tu reserva.',
      suggestedReplies: ['Agendar una cita', 'Ver servicios', 'Cotizar un diseño'],
      widgetType: 'booking_flow',
      error: 'Modo fixtures: respuesta local de demostración.',
    };
  }
  if (/foto|cotiz|diseño|diseno|uñas|unas/.test(normalized)) {
    return {
      text: 'Comparte una referencia de uñas para ver una estimación de técnica, tiempo y precio.',
      suggestedReplies: ['Cotizar un diseño', 'Agendar una cita'],
      widgetType: 'photo_quote',
      error: 'Modo fixtures: respuesta local de demostración.',
    };
  }
  return {
    text: '¡Hola! Soy Emme, tu asistente de belleza. Puedo ayudarte con servicios, cotizaciones y reservas.',
    suggestedReplies: ['Ver servicios', 'Cotizar un diseño', 'Agendar una cita'],
    error: 'Modo fixtures: respuesta local de demostración.',
  };
}
