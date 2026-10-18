export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  basePriceMXN: number;
  durationMinutes: number;
  description: string;
  iconName?: string;
  isPopular?: boolean;
}

export const DIRECT_SERVICES: ServiceItem[] = [
  {
    id: 'gel-manicure',
    name: 'Gel manicure',
    category: 'Manicura',
    basePriceMXN: 450,
    durationMinutes: 60,
    description: 'Esmaltado en gel de alta durabilidad con preparación completa de uñas.',
    iconName: 'Sparkles',
    isPopular: true
  },
  {
    id: 'acrylic-set',
    name: 'Acrylic set',
    category: 'Estructura',
    basePriceMXN: 700,
    durationMinutes: 100,
    description: 'Set completo de acrílico escultural o con tips para máxima resistencia.',
    iconName: 'ShieldCheck',
    isPopular: true
  },
  {
    id: 'gel-extensions',
    name: 'Gel extensions',
    category: 'Extensiones',
    basePriceMXN: 800,
    durationMinutes: 90,
    description: 'Soft gel o polygel de flexibilidad y ligereza superior.',
    iconName: 'Layers',
    isPopular: true
  },
  {
    id: 'removal',
    name: 'Removal',
    category: 'Complemento',
    basePriceMXN: 200,
    durationMinutes: 30,
    description: 'Retiro seguro e hidratante sin dañar la uña natural.',
    iconName: 'Trash2'
  },
  {
    id: 'repair',
    name: 'Repair',
    category: 'Mantenimiento',
    basePriceMXN: 150,
    durationMinutes: 25,
    description: 'Reconstrucción individual de uña dañada o fisurada.',
    iconName: 'Wrench'
  }
];
