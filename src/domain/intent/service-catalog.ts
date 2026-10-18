import { 
  QualifiedServiceDefinition, 
  CuratedServicePackage, 
  ServiceConfiguration, 
  NormalizedQuoteCalculation,
  ClientVibeGoal 
} from './types';

export const QUALIFIED_SERVICES: QualifiedServiceDefinition[] = [
  // 1. NAILS / UÑAS
  {
    id: 'structured-gel',
    category: 'nails',
    clientTitle: 'Natural + Máxima Duración',
    clientSubtitle: 'Manicura Rusa con Base Rubber / Gel Estructurado',
    professionalTitle: 'Structured Gel Overlay (Russian Prep)',
    badge: 'Top #1 en México',
    description: 'Nivelación perfecta con gel de alta resistencia sobre tu uña natural. Ideal si buscas fuerza sin extensiones.',
    basePriceMXN: 520,
    baseDurationMinutes: 60,
    whyThisFits: [
      'Aspecto ultra natural y pulido',
      'Protege y hace crecer tu uña natural',
      'Durabilidad garantizada de 3 a 4 semanas'
    ],
    rules: {
      requiresLength: false,
      requiresShape: true,
      requiresArtTier: true,
      requiresFinish: true,
      requiresRemovalCheck: true,
      requiresColor: true
    },
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'sculpted-acrylic',
    category: 'nails',
    clientTitle: 'Acrílico Escultural Premium',
    clientSubtitle: 'Escultura Profesional con Forma y Largo a Medida',
    professionalTitle: 'Sculpted Acrylic Nail Full Set',
    badge: 'Máxima Resistencia',
    description: 'Moldeado artesanal uña por uña para longitud personalizada y resistencia absoluta ante cualquier rutina diaria.',
    basePriceMXN: 920,
    baseDurationMinutes: 105,
    whyThisFits: [
      'Resistencia extrema para largos pronunciados',
      'Corrección de imperfecciones o uñas mordidas',
      'Estructura arquitectónica con curva C perfecta'
    ],
    rules: {
      requiresLength: true,
      requiresShape: true,
      requiresArtTier: true,
      requiresFinish: true,
      requiresRemovalCheck: true,
      requiresColor: true
    },
    imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'gel-x-extensions',
    category: 'nails',
    clientTitle: 'Extensiones Ligeras & Flexibles',
    clientSubtitle: 'Soft Gel Extensions (Gel-X System)',
    professionalTitle: 'Gel-X Soft Gel Full Cover Extensions',
    badge: 'Tendencia Top',
    description: 'Extensiones completas de soft gel que se adhieren sin dañar la uña natural. Ligeras, resistentes y estilizadas.',
    basePriceMXN: 850,
    baseDurationMinutes: 90,
    whyThisFits: [
      'Alarga tus uñas al instante con cualquier forma',
      'Sin olor fuerte a monómero ni limado agresivo',
      'Ligeras como pluma con acabado de salón de lujo'
    ],
    rules: {
      requiresLength: true,
      requiresShape: true,
      requiresArtTier: true,
      requiresFinish: true,
      requiresRemovalCheck: true,
      requiresColor: true
    },
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'classic-gelish',
    category: 'nails',
    clientTitle: 'Color Semipermanente Clásico',
    clientSubtitle: 'Esmaltado en Gel con Limpieza Express',
    professionalTitle: 'Classic Gel Polish Manicure',
    description: 'Esmaltado en gel curado en lámpara LED con variedad de más de 120 tonos en tendencia.',
    basePriceMXN: 380,
    baseDurationMinutes: 45,
    whyThisFits: [
      'Servicio ágil de menos de 50 minutos',
      'Brillo cristalino por 2+ semanas',
      'Ideal para mantenimiento frecuente'
    ],
    rules: {
      requiresLength: false,
      requiresShape: false,
      requiresArtTier: true,
      requiresFinish: true,
      requiresRemovalCheck: true,
      requiresColor: true
    },
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'safe-removal-only',
    category: 'nails',
    clientTitle: 'Retiro Seguro de Producto',
    clientSubtitle: 'Retiro con Torno + Tratamiento de Queratina',
    professionalTitle: 'Safe E-File Product Removal & Keratin Care',
    description: 'Retiro suave y profesional de acrílico, polygel o gel sin dañar tus capas de uña natural.',
    basePriceMXN: 220,
    baseDurationMinutes: 30,
    whyThisFits: [
      'Preserva la salud y grosor de tus uñas',
      'Incluye aceite regenerador de cutícula y fortalecedor',
      'Rápido y sin dolor'
    ],
    rules: {
      requiresLength: false,
      requiresShape: false,
      requiresArtTier: false,
      requiresFinish: false,
      requiresRemovalCheck: false,
      requiresColor: false
    },
    imageUrl: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=600&auto=format&fit=crop&q=80'
  },

  // 2. PEDICURE / PEDICURA & JELLY SPA
  {
    id: 'pedicure-spa-deluxe',
    category: 'pedicure',
    clientTitle: 'Pedicura Jelly Spa Deluxe + Gel',
    clientSubtitle: 'Baño Gelatinoso con Aromaterapia, Exfoliación & Esmaltado',
    professionalTitle: 'Deluxe Jelly Spa Pedicure with Gel Polish',
    badge: 'Máximo Relax',
    description: 'Tratamiento completo sensorial de pies con tina gelatinosa caliente, sales minerales, exfoliación y esmaltado en gel.',
    basePriceMXN: 580,
    baseDurationMinutes: 60,
    whyThisFits: [
      'Elimina asperezas y renueva la piel de tus pies',
      'Incluye masaje relajante con aceites botánicos',
      'Acabado en gel resistente al agua y calzado'
    ],
    rules: {
      requiresLength: false,
      requiresShape: false,
      requiresArtTier: false,
      requiresFinish: true,
      requiresRemovalCheck: true,
      requiresColor: true
    },
    imageUrl: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'pedicure-russian-clinical',
    category: 'pedicure',
    clientTitle: 'Pedicura Clínica / Rusa Especializada',
    clientSubtitle: 'Limpieza con Torno Podológico, Retiro de Durezas & Brillo',
    professionalTitle: 'Russian Clinical Pedicure & Podology Care',
    badge: 'Cuidado Médico',
    description: 'Limpieza profunda e higiénica de talones y cutículas con fresas esterilizadas para máxima suavidad y salud podal.',
    basePriceMXN: 480,
    baseDurationMinutes: 50,
    whyThisFits: [
      'Tratamiento correctivo para talones agrietados',
      'Higiene 100% libre de humedad previa',
      'Ideal para deportistas o descanso de calzado alto'
    ],
    rules: {
      requiresLength: false,
      requiresShape: false,
      requiresArtTier: false,
      requiresFinish: false,
      requiresRemovalCheck: true,
      requiresColor: true
    },
    imageUrl: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=600&auto=format&fit=crop&q=80'
  },

  // 3. LASHES / PESTAÑAS
  {
    id: 'lashes-volume-natural',
    category: 'lashes',
    clientTitle: 'Extensiones de Pestañas Clásicas (1 a 1)',
    clientSubtitle: 'Efecto Rímel Natural Pelo a Pelo',
    professionalTitle: 'Classic 1:1 Lash Extensions',
    badge: 'Mirada Impactante',
    description: 'Aplicación minuciosa pelo a pelo con adhesivo hipoalergénico de grado médico para alargar tu mirada con elegancia natural.',
    basePriceMXN: 750,
    baseDurationMinutes: 80,
    whyThisFits: [
      'Despierta lista sin necesidad de maquillaje',
      'Diseño personalizado según tu tipo de ojo',
      'Fibras de seda ultra ligeras'
    ],
    rules: {
      requiresLength: false,
      requiresShape: false,
      requiresArtTier: false,
      requiresFinish: false,
      requiresRemovalCheck: true,
      requiresColor: false
    },
    imageUrl: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'lashes-russian-volume',
    category: 'lashes',
    clientTitle: 'Volumen Ruso / Híbrido Glamour',
    clientSubtitle: 'Abanicos 3D/5D para Densidad y Mirada Foxy',
    professionalTitle: 'Russian Volume & Hybrid Lash Extensions',
    badge: 'Densidad Total',
    description: 'Abanicos artesanales ultralivianos que multiplican la cantidad de tus pestañas naturales con acabado tupido y sedoso.',
    basePriceMXN: 950,
    baseDurationMinutes: 100,
    whyThisFits: [
      'Efecto delineado y tupido permanente',
      'Abanicos hechos a mano sin peso excesivo',
      'Durabilidad de 3 a 5 semanas'
    ],
    rules: {
      requiresLength: false,
      requiresShape: false,
      requiresArtTier: false,
      requiresFinish: false,
      requiresRemovalCheck: true,
      requiresColor: false
    },
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'lashes-lifting-keratin',
    category: 'lashes',
    clientTitle: 'Lifting de Pestañas con Keratina + Tinte',
    clientSubtitle: 'Curvatura Natural con Tratamiento Nutritivo',
    professionalTitle: 'Keratin Lash Lift & Dark Tinting',
    badge: '100% Uña / Pestaña Natural',
    description: 'Eleva y tiñe tus propias pestañas desde la raíz con botox de keratina orgánica para un efecto arqueado que dura hasta 6 semanas.',
    basePriceMXN: 490,
    baseDurationMinutes: 50,
    whyThisFits: [
      'Cero mantenimiento ni adhesivos pesados',
      'Nutre y engrosa la fibra capilar de la pestaña',
      'Resistente a albercas, gimnasio y desmaquillantes'
    ],
    rules: {
      requiresLength: false,
      requiresShape: false,
      requiresArtTier: false,
      requiresFinish: false,
      requiresRemovalCheck: false,
      requiresColor: false
    },
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80'
  },

  // 4. BROWS / CEJAS
  {
    id: 'brows-lamination-keratin',
    category: 'brows',
    clientTitle: 'Laminado de Cejas con Keratina + Diseño',
    clientSubtitle: 'Efecto Fluffy & Fijación Direccional con Tinte',
    professionalTitle: 'Brow Lamination, Shaping & Hybrid Tint',
    badge: 'Tendencia Top',
    description: 'Direcciona y disciplina los vellos rebeldes logrando unas cejas más pobladas, simétricas y definidas con tinte semipermanente.',
    basePriceMXN: 480,
    baseDurationMinutes: 45,
    whyThisFits: [
      'Efecto de cejas más gruesas y peinadas',
      'Cubre espacios despoblados visualmente',
      'Incluye perfilado y depilación con hilo orgánico'
    ],
    rules: {
      requiresLength: false,
      requiresShape: false,
      requiresArtTier: false,
      requiresFinish: false,
      requiresRemovalCheck: false,
      requiresColor: false
    },
    imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'brows-henna-shaping',
    category: 'brows',
    clientTitle: 'Diseño & Perfilado con Henna Orgánica',
    clientSubtitle: 'Visagismo Facial, Depilación y Sombreado de Ceja',
    professionalTitle: 'Organic Henna Brow Architecture & Shaping',
    badge: 'Visagismo',
    description: 'Medición geométrica del rostro, perfilado limpio y sombreado botánico con henna que tiñe pelo y piel hasta 14 días.',
    basePriceMXN: 350,
    baseDurationMinutes: 35,
    whyThisFits: [
      'Pigmento 100% natural libre de amoníaco',
      'Define el marco de tu rostro con precisión milimétrica',
      'Efecto sombreado tipo microblading temporal'
    ],
    rules: {
      requiresLength: false,
      requiresShape: false,
      requiresArtTier: false,
      requiresFinish: false,
      requiresRemovalCheck: false,
      requiresColor: false
    },
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80'
  },

  // 5. SPA & TRATAMIENTOS
  {
    id: 'spa-paraffin-hands',
    category: 'spa',
    clientTitle: 'Spa Restaurador de Manos & Parafina Tibia',
    clientSubtitle: 'Exfoliación con Sales de Mar, Mascarilla & Aceites Esenciales',
    professionalTitle: 'Warm Paraffin Restorative Hand Therapy',
    badge: 'Hidratación Profunda',
    description: 'Envoltura de parafina caliente con manteca de karité y colágeno para rejuvenecer e hidratar manos secas o maltratadas.',
    basePriceMXN: 320,
    baseDurationMinutes: 30,
    whyThisFits: [
      'Alivia tirantez y resequedad por frío o desinfectantes',
      'Deja la piel suave como terciopelo',
      'Incluye masaje reflexológico de manos'
    ],
    rules: {
      requiresLength: false,
      requiresShape: false,
      requiresArtTier: false,
      requiresFinish: false,
      requiresRemovalCheck: false,
      requiresColor: false
    },
    imageUrl: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=600&auto=format&fit=crop&q=80'
  }
];

export const CURATED_PACKAGES: CuratedServicePackage[] = [
  {
    id: 'pkg-clean-girl',
    title: 'Clean & Natural Look',
    vibeTag: 'Elegancia Minimalista',
    subtitle: 'Manicura Rusa + Base Rubber Leche + Forma Almendra',
    priceMXN: 520,
    durationMinutes: 55,
    durationFormatted: '55 min',
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&auto=format&fit=crop&q=80',
    highlights: ['Uñas limpias y pulidas', 'Bajo mantenimiento', 'Ideal para trabajo u oficina'],
    popularFor: 'Recomendado para uso diario profesional',
    defaultConfig: {
      serviceId: 'structured-gel',
      serviceTitle: 'Natural + Máxima Duración',
      clientVibeLabel: 'Clean & Natural Look',
      length: 'natural',
      shape: 'almond',
      finish: 'milky',
      artTier: 0,
      hasExistingProduct: false
    }
  },
  {
    id: 'pkg-french-glazed',
    title: 'Glazed French Statement',
    vibeTag: 'Hailey Bieber Trend',
    subtitle: 'Gel-X Mediano + Polvo Cromado Glazed + Micro-French',
    priceMXN: 950,
    durationMinutes: 105,
    durationFormatted: '1h 45m',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&auto=format&fit=crop&q=80',
    highlights: ['Efecto perla satinado', 'Largo estilizado pero cómodo', 'Fotogénico para eventos'],
    popularFor: 'Bodas, cenas y eventos especiales',
    defaultConfig: {
      serviceId: 'gel-x-extensions',
      serviceTitle: 'Extensiones Ligeras Gel-X',
      clientVibeLabel: 'Glazed French Statement',
      length: 'medium',
      shape: 'almond',
      finish: 'chrome',
      artTier: 2,
      artTags: ['Micro-French Blanco', 'Efecto Glazed Donut Chrome'],
      hasExistingProduct: false
    }
  },
  {
    id: 'pkg-spa-combo',
    title: 'Dúo Manos & Pies Spa',
    vibeTag: 'Cuidado Integral',
    subtitle: 'Manicura con Gel + Pedicura Spa Profunda',
    priceMXN: 880,
    durationMinutes: 100,
    durationFormatted: '1h 40m',
    imageUrl: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=600&auto=format&fit=crop&q=80',
    highlights: ['Ahorro de tiempo en sesión combinada', 'Exfoliación e hidratación completa', 'Tonos coordinados'],
    popularFor: 'Renovación mensual completa',
    defaultConfig: {
      serviceId: 'pedicure-spa-deluxe',
      serviceTitle: 'Pedicura Spa Profunda + Gel',
      clientVibeLabel: 'Dúo Manos & Pies Spa',
      length: 'natural',
      shape: 'natural',
      finish: 'glossy',
      artTier: 0,
      hasExistingProduct: false
    }
  }
];

export function mapIntentGoalToService(goal: ClientVibeGoal): QualifiedServiceDefinition {
  switch (goal) {
    case 'clean_natural':
    case 'durable_gel':
      return QUALIFIED_SERVICES.find(s => s.id === 'structured-gel') || QUALIFIED_SERVICES[0];
    case 'long_extensions':
      return QUALIFIED_SERVICES.find(s => s.id === 'gel-x-extensions') || QUALIFIED_SERVICES[1];
    case 'nail_art_statement':
      return QUALIFIED_SERVICES.find(s => s.id === 'gel-x-extensions') || QUALIFIED_SERVICES[1];
    case 'pedi_spa':
      return QUALIFIED_SERVICES.find(s => s.id === 'pedicure-spa-deluxe') || QUALIFIED_SERVICES[4];
    case 'repair_removal':
      return QUALIFIED_SERVICES.find(s => s.id === 'safe-removal-only') || QUALIFIED_SERVICES[6];
    case 'unsure':
    default:
      return QUALIFIED_SERVICES[0];
  }
}

export function calculateDeterministicQuote(
  service: QualifiedServiceDefinition,
  config: Partial<ServiceConfiguration>
): NormalizedQuoteCalculation {
  const breakdown: NormalizedQuoteCalculation['breakdown'] = [];

  // 1. Base Service Price & Time
  breakdown.push({
    label: service.clientTitle,
    amountMXN: service.basePriceMXN,
    durationDeltaMinutes: service.baseDurationMinutes
  });

  let totalPrice = service.basePriceMXN;
  let totalDuration = service.baseDurationMinutes;

  // 2. Length Delta (if required)
  if (service.rules.requiresLength && config.length) {
    if (config.length === 'medium') {
      breakdown.push({ label: 'Largo Mediano (+15 min)', amountMXN: 80, durationDeltaMinutes: 15 });
      totalPrice += 80;
      totalDuration += 15;
    } else if (config.length === 'long' || config.length === 'xl') {
      breakdown.push({ label: 'Largo Largo/XL (+25 min)', amountMXN: 160, durationDeltaMinutes: 25 });
      totalPrice += 160;
      totalDuration += 25;
    }
  }

  // 3. Shape Delta (e.g. Coffin, Stiletto require sculpt shaping)
  if (service.rules.requiresShape && config.shape && (config.shape === 'coffin' || config.shape === 'stiletto')) {
    breakdown.push({ label: `Forma Especial (${config.shape})`, amountMXN: 50, durationDeltaMinutes: 10 });
    totalPrice += 50;
    totalDuration += 10;
  }

  // 4. Finish Delta
  if (service.rules.requiresFinish && config.finish) {
    if (config.finish === 'chrome') {
      breakdown.push({ label: 'Efecto Glazed Chrome (+10 min)', amountMXN: 140, durationDeltaMinutes: 10 });
      totalPrice += 140;
      totalDuration += 10;
    } else if (config.finish === 'cat_eye') {
      breakdown.push({ label: 'Efecto Ojo de Gato Cat-Eye', amountMXN: 130, durationDeltaMinutes: 10 });
      totalPrice += 130;
      totalDuration += 10;
    } else if (config.finish === 'matte') {
      breakdown.push({ label: 'Acabado Velvet Matte', amountMXN: 40, durationDeltaMinutes: 0 });
      totalPrice += 40;
    }
  }

  // 5. Nail Art Tier Delta
  if (service.rules.requiresArtTier && typeof config.artTier === 'number' && config.artTier > 0) {
    const tierMap: Record<number, { label: string; price: number; time: number }> = {
      1: { label: 'Nail Art Nivel 1 (Micro-French / Puntos)', price: 120, time: 15 },
      2: { label: 'Nail Art Nivel 2 (Diseño en 4 uñas / Mármol)', price: 220, time: 25 },
      3: { label: 'Nail Art Nivel 3 (Arte mano alzada / Dijes 3D)', price: 340, time: 35 },
      4: { label: 'Nail Art Nivel 4 (Diseño de autor en 10 uñas)', price: 480, time: 45 }
    };
    const tier = tierMap[config.artTier] || tierMap[1];
    breakdown.push({ label: tier.label, amountMXN: tier.price, durationDeltaMinutes: tier.time });
    totalPrice += tier.price;
    totalDuration += tier.time;
  }

  // 6. Safe Removal Delta
  if (service.rules.requiresRemovalCheck && config.hasExistingProduct) {
    breakdown.push({ label: 'Retiro de producto previo con torno (+20 min)', amountMXN: 120, durationDeltaMinutes: 20 });
    totalPrice += 120;
    totalDuration += 20;
  }

  // Calculate 30% deposit rounded to nearest 50 MXN (Min $200)
  const depositMXN = Math.max(200, Math.round((totalPrice * 0.3) / 50) * 50);

  const hours = Math.floor(totalDuration / 60);
  const mins = totalDuration % 60;
  const durationFormatted = hours > 0 ? (mins > 0 ? `${hours}h ${mins}m` : `${hours}h`) : `${mins} min`;

  const configSummaryParts = [
    service.clientTitle,
    config.length ? `Largo ${config.length}` : null,
    config.shape ? `Punta ${config.shape}` : null,
    config.finish && config.finish !== 'glossy' ? `Acabado ${config.finish}` : null,
    config.artTier ? `Art T${config.artTier}` : null,
    config.hasExistingProduct ? 'Con retiro' : 'Sin retiro'
  ].filter(Boolean);

  return {
    basePriceMXN: service.basePriceMXN,
    totalPriceMXN: totalPrice,
    depositMXN,
    durationMinutes: totalDuration,
    durationFormatted,
    breakdown,
    configurationSummary: configSummaryParts.join(' · '),
    depositRule: `Anticipo de $${depositMXN} MXN para apartar horario (deducible en el salón)`
  };
}
