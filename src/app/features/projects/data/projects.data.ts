export interface ProjectFeature {
  readonly icon: string;
  readonly label: string;
}

export interface ProjectItem {
  readonly slug: string;
  readonly name: string;
  readonly location: string;
  readonly description: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly category: string;
  readonly priceFrom: string;
  readonly status: 'En construcción' | 'Próximamente';
  readonly features: readonly ProjectFeature[];
}

export const PROJECTS: readonly ProjectItem[] = [
  {
    slug: 'chancay',
    name: 'Proyecto Montepinar',
    location: 'Chancay',
    description: 'Un desarrollo residencial pensado para construir un futuro a tu medida, rodeado de áreas verdes.',
    image: '/images/PalmerasdeMontepinar.png',
    imageAlt: 'Acceso principal a Montepinar',
    category: 'Desarrollo residencial',
    priceFrom: 'S/ 18,000',
    status: 'En construcción',
    features: [
      { icon: 'lucideRuler', label: '300 m² a 650 m²' },
      { icon: 'lucideUsers', label: 'Club privado' },
      { icon: 'lucideShieldCheck', label: 'Seguridad 24/7' },
      { icon: 'lucideSprout', label: '40% áreas verdes' },
    ],
  },
  {
    slug: 'huaral',
    name: 'Espacios para disfrutar',
    location: 'Huaral',
    description: 'Áreas recreativas y deportivas para compartir en familia y disfrutar cada día del año.',
    image: '/images/AsociacionMontepinar.webp',
    imageAlt: 'Vista aérea de las áreas deportivas de Montepinar',
    category: 'Áreas comunes',
    priceFrom: 'S/ 18,000',
    status: 'Próximamente',
    features: [
      { icon: 'lucideRuler', label: '350 m² a 800 m²' },
      { icon: 'lucideTrophy', label: 'Pádel y tenis' },
      { icon: 'lucideDroplets', label: 'Riego tecnificado' },
      { icon: 'lucideSun', label: 'Sol todo el año' },
    ],
  },
  {
    slug: 'iquitos',
    name: 'Una comunidad en crecimiento',
    location: 'Iquitos',
    description: 'Conoce los avances y el entorno natural que está dando vida a Montepinar en la selva.',
    image: '/images/MontepinarIquitos.webp',
    imageAlt: 'Recorrido de visitantes por el proyecto Montepinar',
    category: 'Eco-residencial',
    priceFrom: 'S/ 18,000',
    status: 'En construcción',
    features: [
      { icon: 'lucideRuler', label: '500 m² a 1,200 m²' },
      { icon: 'lucideWaves', label: 'Laguna privada' },
      { icon: 'lucideZap', label: 'Eco-energía' },
      { icon: 'lucideTreePine', label: 'Bosque protegido' },
    ],
  },
];
