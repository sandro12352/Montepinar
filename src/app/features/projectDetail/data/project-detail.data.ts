import { PROJECTS, ProjectItem } from '../../projects/data/projects.data';

export interface LotPlan {
  readonly name: string;
  readonly area: number;
  readonly price: number;
  readonly frontage: string;
  readonly description: string;
  readonly tag?: string;
}

export interface Amenity {
  readonly icon: string;
  readonly label: string;
  readonly text: string;
}

export interface NearbyPlace {
  readonly label: string;
  readonly distance: string;
}

export interface LegalItem {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
  /** Archivo del documento, dentro de public/documents. */
  readonly file: string;
  /** Número o dato oficial, si se quiere destacar junto al documento. */
  readonly reference?: string;
}

export interface ProjectDetail extends ProjectItem {
  readonly tagline: string;
  readonly overview: string;
  readonly facts: readonly { readonly value: string; readonly label: string }[];
  readonly amenities: readonly Amenity[];
  readonly gallery: readonly { readonly src: string; readonly alt: string }[];
  readonly plans: readonly LotPlan[];
  readonly mapQuery: string;
  readonly address: string;
  readonly nearby: readonly NearbyPlace[];
  readonly financing: {
    readonly minInitialPercent: number;
    readonly maxMonths: number;
    /** TEA en %. 0 = cuotas sin interés. */
    readonly annualRate: number;
  };
  readonly legal: readonly LegalItem[];
}

type ProjectExtra = Omit<ProjectDetail, keyof ProjectItem>;

// Contenido referencial: precios, medidas y distancias deben validarse con el equipo comercial.
const LEGAL_DOCS: readonly Omit<LegalItem, 'file'>[] = [
  {
    icon: 'lucideScrollText',
    title: 'Título de propiedad',
    description: 'Acredita a Montepinar como propietario del terreno donde se desarrolla el proyecto.',
  },
  {
    icon: 'lucideLandmark',
    title: 'Partida registral (SUNARP)',
    description: 'Inscripción del predio en Registros Públicos, con su historial de cargas y gravámenes.',
  },
  {
    icon: 'lucideMap',
    title: 'Habilitación y zonificación',
    description: 'Planos de lotización y zonificación para uso de vivienda campestre.',
  },
  {
    icon: 'lucideFileCheck',
    title: 'Contrato de compraventa',
    description: 'Modelo de minuta con el cronograma de pagos y las condiciones de la compra.',
  },
];

const LEGAL_FILES = ['titulo-propiedad', 'partida-registral', 'habilitacion-zonificacion', 'contrato-compraventa'];

/** Los PDF viven en public/documents/<slug>/<archivo>.pdf. */
const legalFor = (slug: string): readonly LegalItem[] =>
  LEGAL_DOCS.map((doc, index) => ({ ...doc, file: `/documents/${slug}/${LEGAL_FILES[index]}.pdf` }));

const EXTRA: Record<string, ProjectExtra> = {
  chancay: {
    tagline: 'Un lugar propio, a minutos del nuevo puerto.',
    overview:
      'Palmeras de Montepinar es un desarrollo campestre con lotes desde 120 m² hasta 1,000 m², más de 2,000 áreas verdes, country club y seguridad permanente. Un terreno pensado para construir tu casa de campo hoy y ver crecer su valor mientras la zona se desarrolla.',
    facts: [
      { value: '120 m²', label: 'Lote mínimo' },
      { value: '+2,000', label: 'Áreas verdes' },
      { value: '24/7', label: 'Seguridad' },
      { value: '60', label: 'Meses para pagar' },
    ],
    amenities: [
      { icon: 'lucideUsers', label: 'Country club', text: 'Zona social y parrilleras para toda la familia.' },
      { icon: 'lucideShieldCheck', label: 'Seguridad 24/7', text: 'Ingreso controlado y vigilancia permanente.' },
      { icon: 'lucideSprout', label: 'Áreas verdes', text: 'Más de 2,000 áreas verdes, con jardines y alamedas.' },
      { icon: 'lucideZap', label: 'Servicios básicos', text: 'Accesos y servicios planificados hasta tu lote.' },
    ],
    gallery: [
      { src: '/images/PalmerasdeMontepinar.png', alt: 'Ingreso principal de Montepinar' },
      { src: '/images/entrada.png', alt: 'Entrada al proyecto' },
      { src: '/images/presentacion.webp', alt: 'Presentación del proyecto' },
      { src: '/images/introduccion.png', alt: 'Vista del entorno' },
      { src: '/images/slide2.webp', alt: 'Áreas del proyecto' },
    ],
    plans: [
      { name: 'Lote Jardín', area: 120, price: 18000, frontage: '8 × 15 m', description: 'Ideal para tu primera casa de campo.', tag: 'Más accesible' },
      { name: 'Lote Familiar', area: 450, price: 27000, frontage: '15 × 30 m', description: 'Espacio para casa, jardín y zona de parrilla.', tag: 'Más elegido' },
      { name: 'Lote Premium', area: 1000, price: 39000, frontage: '25 × 40 m', description: 'Frente amplio y máxima privacidad.' },
    ],
    mapQuery: 'Chancay, Lima, Perú',
    address: 'Distrito de Chancay, provincia de Huaral, Lima',
    nearby: [
      { label: 'Puerto de Chancay', distance: '15 min' },
      { label: 'Panamericana Norte', distance: '5 min' },
      { label: 'Centro de Chancay', distance: '10 min' },
      { label: 'Lima', distance: '1 h 30 min' },
    ],
    financing: { minInitialPercent: 10, maxMonths: 60, annualRate: 0 },
    legal: [],
  },
  huaral: {
    tagline: 'Tu lote cerca de todo, junto a Mall Montepinar.',
    overview:
      'Asociación Montepinar reúne lotes de 120 a 200 m² junto a Mall Montepinar, con más de 5,000 áreas verdes y un clima soleado casi todo el año. Un proyecto pensado para disfrutar el campo sin renunciar a la comodidad.',
    facts: [
      { value: '120 m²', label: 'Lote mínimo' },
      { value: '+5,000', label: 'Áreas verdes' },
      { value: '365', label: 'Días de sol' },
      { value: '48', label: 'Meses para pagar' },
    ],
    amenities: [
      { icon: 'lucideStore', label: 'Mall Montepinar', text: 'Comercio y servicios cerca de tu lote.' },
      { icon: 'lucideSprout', label: 'Áreas verdes', text: 'Más de 5,000 áreas verdes para el descanso y la recreación.' },
      { icon: 'lucideSun', label: 'Clima soleado', text: 'Sol casi todo el año, ideal para el descanso.' },
      { icon: 'lucideShieldCheck', label: 'Acceso controlado', text: 'Ingreso con vigilancia y registro de visitas.' },
    ],
    gallery: [
      { src: '/images/AsociacionMontepinar.webp', alt: 'Vista aérea de las áreas deportivas' },
      { src: '/images/slide3.webp', alt: 'Áreas comunes' },
      { src: '/images/Entrada%20Montepinar%20entre%20jardines%20y%20banderas.png', alt: 'Entrada entre jardines' },
      { src: '/images/introduccion.png', alt: 'Vista del entorno' },
      { src: '/images/presentacion.webp', alt: 'Presentación del proyecto' },
    ],
    plans: [
      { name: 'Lote Campo', area: 120, price: 15000, frontage: '8 × 15 m', description: 'Tu primer paso en el campo, listo para construir.', tag: 'Más accesible' },
      { name: 'Lote Jardín', area: 160, price: 25500, frontage: '8 × 20 m', description: 'Un poco más de espacio para tu jardín.', tag: 'Más elegido' },
      { name: 'Lote Amplio', area: 200, price: 40000, frontage: '10 × 20 m', description: 'La mayor amplitud dentro del proyecto.' },
    ],
    mapQuery: 'Huaral, Lima, Perú',
    address: 'Provincia de Huaral, Lima',
    nearby: [
      { label: 'Centro de Huaral', distance: '10 min' },
      { label: 'Panamericana Norte', distance: '8 min' },
      { label: 'Puerto de Chancay', distance: '35 min' },
      { label: 'Lima', distance: '1 h 15 min' },
    ],
    financing: { minInitialPercent: 15, maxMonths: 48, annualRate: 0 },
    legal: [],
  },
  iquitos: {
    tagline: 'Naturaleza viva a las puertas de la selva.',
    overview:
      'Amazon Lodge Montepinar es un proyecto eco-residencial con lotes generosos, laguna privada y bosque protegido. Un lugar para vivir cerca de la naturaleza con energía limpia y una comunidad que crece contigo.',
    facts: [
      { value: '500 m²', label: 'Lote mínimo' },
      { value: '1', label: 'Laguna privada' },
      { value: '100%', label: 'Eco-energía' },
      { value: '60', label: 'Meses para pagar' },
    ],
    amenities: [
      { icon: 'lucideWaves', label: 'Laguna privada', text: 'Un espejo de agua para el descanso y la recreación.' },
      { icon: 'lucideTreePine', label: 'Bosque protegido', text: 'Áreas de conservación dentro del proyecto.' },
      { icon: 'lucideZap', label: 'Eco-energía', text: 'Sistemas de energía limpia para las áreas comunes.' },
      { icon: 'lucideUsers', label: 'Comunidad', text: 'Zonas sociales para compartir con tus vecinos.' },
    ],
    gallery: [
      { src: '/images/MontepinarIquitos.webp', alt: 'Recorrido de visitantes por el proyecto' },
      { src: '/images/slide2.webp', alt: 'Entorno natural' },
      { src: '/images/slide3.webp', alt: 'Áreas del proyecto' },
      { src: '/images/presentacion.webp', alt: 'Presentación del proyecto' },
      { src: '/images/introduccion.png', alt: 'Vista del entorno' },
    ],
    plans: [
      { name: 'Lote Bosque', area: 500, price: 18000, frontage: '15 × 33 m', description: 'Rodeado de vegetación, ideal para empezar.', tag: 'Más accesible' },
      { name: 'Lote Laguna', area: 800, price: 28800, frontage: '20 × 40 m', description: 'Cerca de la laguna y las áreas sociales.', tag: 'Más elegido' },
      { name: 'Lote Selva', area: 1200, price: 43200, frontage: '30 × 40 m', description: 'La máxima amplitud para tu proyecto de vida.' },
    ],
    mapQuery: 'Iquitos, Loreto, Perú',
    address: 'Iquitos, provincia de Maynas, Loreto',
    nearby: [
      { label: 'Aeropuerto de Iquitos', distance: '25 min' },
      { label: 'Centro de Iquitos', distance: '30 min' },
      { label: 'Río Nanay', distance: '15 min' },
      { label: 'Colegios y clínicas', distance: '25 min' },
    ],
    financing: { minInitialPercent: 10, maxMonths: 60, annualRate: 0 },
    legal: [],
  },
};

export function getProjectDetail(slug: string | null | undefined): ProjectDetail | undefined {
  const base = PROJECTS.find((project) => project.slug === slug);
  return base && slug ? { ...base, ...EXTRA[slug], legal: legalFor(slug) } : undefined;
}
