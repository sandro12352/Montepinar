export interface ProjectFeature {
  readonly icon: string;
  readonly label: string;
}

export interface ProjectItem {
  readonly slug: string;
  readonly name: string;
  readonly location: string;
  /** Dirección o búsqueda que se abre en Google Maps. */
  readonly mapQuery: string;
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
    name: 'Palmeras de Montepinar',
    location: 'Chancay',
    mapQuery: 'Chancay, Lima, Perú',
    description: 'Un desarrollo residencial pensado para construir un futuro a tu medida, rodeado de áreas verdes.',
    image: '/images/PalmerasdeMontepinar.png',
    imageAlt: 'Acceso principal a Montepinar',
    category: 'Desarrollo residencial',
    priceFrom: 'S/ 18,000',
    status: 'En construcción',
    features: [
      { icon: 'lucideRuler', label: '120 m² a 1,000 m²' },
      { icon: 'lucideUsers', label: 'Country club' },
      { icon: 'lucideShieldCheck', label: 'Seguridad 24/7' },
      { icon: 'lucideSprout', label: '+2,000 áreas verdes' },
    ],
  },
  {
    slug: 'huaral',
    name: 'Asociación Montepinar',
    location: 'Huaral',
    mapQuery: 'Asociacion Vivienda Montepinar Lt, Carretera Panamericana Norte, Huacho',
    description: 'Lotes accesibles junto a Mall Montepinar, con más de 5,000 áreas verdes para disfrutar en familia.',
    image: '/images/AsociacionMontepinar.webp',
    imageAlt: 'Vista aérea de las áreas deportivas de Montepinar',
    category: 'Áreas comunes',
    priceFrom: 'S/ 15,000',
    status: 'Próximamente',
    features: [
      { icon: 'lucideRuler', label: '120 m² a 200 m²' },
      { icon: 'lucideStore', label: 'Mall Montepinar' },
      { icon: 'lucideSprout', label: '+5,000 áreas verdes' },
      { icon: 'lucideSun', label: 'Sol todo el año' },
    ],
  },
  {
    slug: 'iquitos',
    name: 'Amazon Lodge Montepinar',
    location: 'Iquitos',
    mapQuery: 'Iquitos, Loreto, Perú',
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
