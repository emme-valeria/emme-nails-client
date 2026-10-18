export interface Artist {
  id: string;
  name: string;
  specialty: string;
  avatarUrl?: string;
}

export const ARTISTS: Artist[] = [
  { id: 'any', name: 'Cualquier artista libre', specialty: 'Asignación automática rápida' },
  { id: 'valeria', name: 'Valeria Arriaza', specialty: 'Especialista en Soft Gel & Chrome' },
  { id: 'sofia', name: 'Sofia Martínez', specialty: 'Especialista en Acrílico & 3D Charms' }
];

export const AVAILABLE_SLOTS = [
  '10:00 AM',
  '12:30 PM',
  '02:30 PM',
  '04:00 PM',
  '06:00 PM'
];
