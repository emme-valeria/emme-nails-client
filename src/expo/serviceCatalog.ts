import type { ImageSourcePropType } from 'react-native';

export type StudioService = {
  id: string;
  name: string;
  detail: string;
  technique: string;
  duration: string;
  price: number;
  description: string;
  image: ImageSourcePropType;
};

export const studioServices: StudioService[] = [
  {
    id: 'manicura-express',
    name: 'Manicura Express',
    detail: 'Limpieza, limado y acabado natural',
    technique: 'Manicura natural',
    duration: '30 min',
    price: 200,
    description: 'Un cuidado esencial para dejar tus uñas limpias, prolijas y con un acabado natural.',
    image: require('../assets/images/emme_nail_art_preview_1785913648252.jpg'),
  },
  {
    id: 'manicura-rusa-rubber',
    name: 'Manicura Rusa con Base Rubber',
    detail: 'Nivelación y acabado de larga duración',
    technique: 'Base rubber',
    duration: '60 min',
    price: 520,
    description: 'Preparación detallada de cutícula y nivelación para un acabado uniforme y duradero.',
    image: require('../assets/images/emme_nail_art_preview_1785913648252.jpg'),
  },
  {
    id: 'semi-permanente',
    name: 'Esmaltado Semi-permanente',
    detail: 'Color en gel con curado LED',
    technique: 'Gel · semi-permanente',
    duration: '45 min',
    price: 380,
    description: 'Color intenso con brillo duradero y una selección de tonos para tu estilo.',
    image: require('../assets/images/emme_nail_art_preview_1785913648252.jpg'),
  },
  {
    id: 'soft-gel',
    name: 'Soft Gel (Gel-X Full Cover)',
    detail: 'Extensiones ligeras y naturales',
    technique: 'Soft Gel · Gel-X',
    duration: '90 min',
    price: 850,
    description: 'Extensiones ligeras con forma precisa, listas para personalizar con tu acabado favorito.',
    image: require('../assets/images/emme_nail_art_preview_1785913648252.jpg'),
  },
  {
    id: 'acrilico-escultural',
    name: 'Uñas de Acrílico Esculturales',
    detail: 'Estructura a medida',
    technique: 'Acrílico · escultural',
    duration: '105 min',
    price: 920,
    description: 'Una estructura esculpida a medida para lograr el largo, la forma y el diseño que imaginas.',
    image: require('../assets/images/emme_nail_art_preview_1785913648252.jpg'),
  },
  {
    id: 'pedicura-jelly-spa',
    name: 'Pedicura Jelly Spa Deluxe',
    detail: 'Exfoliación, masaje y esmaltado',
    technique: 'Pedicura spa',
    duration: '60 min',
    price: 580,
    description: 'Un ritual de cuidado con exfoliación, masaje y esmaltado para un momento de pausa.',
    image: require('../assets/images/emme_spa_studio_1785913663313.jpg'),
  },
];

export function findStudioService(value?: string) {
  if (!value) return studioServices[0];
  return studioServices.find((service) => service.id === value || service.name === value) ?? studioServices[0];
}
