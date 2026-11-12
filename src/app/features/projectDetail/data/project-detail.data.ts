import { PROJECTS, ProjectItem } from '../../projects/data/projects.data';
import { HUARAL_SECTORS, IQUITOS_SECTORS, PALMERAS_SECTORS, PriceRow, PriceSector } from './price-list.data';

export interface LotPlan {
  readonly name: string;
  readonly area: number;
  readonly price: number;
  readonly frontage: string;
  readonly description: string;
  readonly tag?: string;
  /** Línea extra bajo el precio (financiamiento, ubicación exacta, etc.). */
  readonly detail?: string;
  /** Posición de la fila real de la lista de precios que representa este lote (para el simulador). */
  readonly pick?: { readonly sector: number; readonly stage: number; readonly group: number; readonly row: number };
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
  /** Lista de precios por sector y etapa, si el proyecto la publica. */
  readonly sectors?: readonly PriceSector[];
  readonly address: string;
  readonly nearby: readonly NearbyPlace[];
  readonly financing: {
    readonly minInitialPercent: number;
    readonly maxMonths: number;
    /** TEA en %. 0 = cuotas sin interés. */
    readonly annualRate: number;
  };
  readonly legal: readonly LegalItem[];
  /** PDF descargable del proyecto (dossier o lista de precios), dentro de public. */
  readonly dossier?: string;
  /** Nombre de la lista de precios, para los textos ("la lista de precios 2026"). */
  readonly priceListName?: string;
  /** Nota al pie de la sección de lotes. */
  readonly priceListNote?: string;
  /** Texto bajo el título de la sección de lotes (si no, se usa el genérico de Interior, Parque y Avenida). */
  readonly plansIntro?: string;
  /** Dibuja la vía y las zonas comunes (áreas verdes, club) junto a los lotes del esquema. */
  readonly mapZones?: boolean;
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

const fmt = (value: number): string => value.toLocaleString('en-US');
const areaRange = (min: number, max: number): string => (min === max ? `${fmt(min)} m²` : `de ${fmt(min)} a ${fmt(max)} m²`);

/** El lote más económico de la lista que cumple el criterio, y el rango de áreas donde existe. */
function cheapest(sectors: readonly PriceSector[], match: (row: PriceRow) => boolean) {
  const hits = sectors.flatMap((sector, si) =>
    sector.stages.flatMap((stage, ti) =>
      stage.groups.flatMap((group, gi) =>
        group.rows
          .map((row, ri) => ({ row, area: group.area, where: `${sector.name} · ${stage.label}`, pick: { sector: si, stage: ti, group: gi, row: ri } }))
          .filter((hit) => match(hit.row)),
      ),
    ),
  );
  const best = hits.reduce((min, hit) => (hit.row.cash < min.row.cash ? hit : min));
  const areas = hits.map((hit) => hit.area);
  return { ...best, range: areaRange(Math.min(...areas), Math.max(...areas)) };
}

/** Interior, Parque y Avenida con los precios "desde" reales de la lista de precios. */
function plansFromSectors(sectors: readonly PriceSector[]): readonly LotPlan[] {
  const build = (name: string, description: (range: string) => string, match: (row: PriceRow) => boolean, tag?: string): LotPlan => {
    const { row, area, where, range, pick } = cheapest(sectors, match);
    return {
      name,
      area,
      price: row.cash,
      frontage: where,
      description: description(range),
      tag,
      pick,
      detail: `${row.location} · financiado S/ ${fmt(row.financed)}, inicial S/ ${fmt(row.initial)} y ${row.months} cuotas de S/ ${fmt(row.installment)}`,
    };
  };

  return [
    build('Interior', (range) => `Lotes interiores ${range}: tranquilos, resguardados y listos para construir.`, (row) => row.location.startsWith('Lote interior'), 'Más accesible'),
    build('Parque', (range) => `Frente al parque, lotes ${range}: ideales para disfrutar del aire libre en familia.`, (row) => /^Frente a .*parque/i.test(row.location)),
    build('Avenida', (range) => `Frente a la avenida principal, lotes ${range}: fácil acceso y mayor visibilidad.`, (row) => row.location.startsWith('Frente a Av. principal')),
  ];
}

/** Un lote por cada fila de la lista de precios, para proyectos cuyas ubicaciones no son interior, parque y avenida. */
function plansFromRows(sectors: readonly PriceSector[], describe: (row: PriceRow) => { description: string; tag?: string }): readonly LotPlan[] {
  return sectors.flatMap((sector, si) =>
    sector.stages.flatMap((stage, ti) =>
      stage.groups.flatMap((group, gi) =>
        group.rows.map((row, ri) => ({
          name: row.location,
          area: group.area,
          price: row.cash,
          frontage: `${sector.name} · ${stage.label}`,
          ...describe(row),
          detail: `financiado S/ ${fmt(row.financed)}, inicial S/ ${fmt(row.initial)} y ${row.months} cuotas de S/ ${fmt(row.installment)}`,
          pick: { sector: si, stage: ti, group: gi, row: ri },
        })),
      ),
    ),
  );
}

const EXTRA: Record<string, ProjectExtra> = {
  'palmeras-de-montepinar': {
    tagline: 'Un lugar propio, a minutos del nuevo puerto.',
    overview:
      'Palmeras de Montepinar es un desarrollo campestre con lotes desde 120 m² hasta 1,000 m², más de 2,000 áreas verdes, country club y seguridad permanente. Un terreno pensado para construir tu casa de campo hoy y ver crecer su valor mientras la zona se desarrolla.',
    facts: [
      { value: '120 m²', label: 'Lote mínimo' },
      { value: '+2,000', label: 'Áreas verdes' },
      { value: '24/7', label: 'Seguridad' },
      { value: '42', label: 'Cuotas máximas' },
    ],
    amenities: [
      { icon: 'lucideUsers', label: 'Country club', text: 'Zona social y parrilleras para toda la familia.' },
      { icon: 'lucideShieldCheck', label: 'Seguridad 24/7', text: 'Ingreso controlado y vigilancia permanente.' },
      { icon: 'lucideSprout', label: 'Áreas verdes', text: 'Más de 2,000 áreas verdes, con jardines y alamedas.' },
      { icon: 'lucideZap', label: 'Servicios básicos', text: 'Accesos y servicios planificados hasta tu lote.' },
    ],
    gallery: [
      { src: '/images/PalmerasdeMontepinar.webp', alt: 'Ingreso principal de Montepinar' },
      { src: '/images/entrada.webp', alt: 'Entrada al proyecto' },
      { src: '/images/gallery/presentacion.webp', alt: 'Presentación del proyecto' },
      { src: '/images/carousel/entrada-palmeras.webp', alt: 'Vista del entorno' },
      { src: '/images/carousel/slide2.webp', alt: 'Áreas del proyecto' },
    ],
    plans: plansFromSectors(PALMERAS_SECTORS),
    sectors: PALMERAS_SECTORS,
    dossier: '/documents/chancay/lista-de-precios-2026.pdf',
    mapZones: true,
    priceListName: 'lista de precios 2026',
    priceListNote: 'Lista de precios 2026, en soles. Esquema no oficial y sin escala; ubicación referencial según el plano de lotización 1/500. Sujeto a disponibilidad y a la validación del equipo comercial.',
    address: 'Distrito de Chancay, provincia de Huaral, Lima',
    nearby: [
      { label: 'Puerto de Chancay', distance: '15 min' },
      { label: 'Panamericana Norte', distance: '5 min' },
      { label: 'Centro de Chancay', distance: '10 min' },
      { label: 'Lima', distance: '1 h 30 min' },
    ],
    financing: { minInitialPercent: 17, maxMonths: 42, annualRate: 0 },
    legal: [],
  },
  'asociacion-de-vivienda-montepinar': {
    tagline: 'Tu lote cerca de todo, junto a Mall Montepinar.',
    overview:
      'Asociación de Vivienda Montepinar reúne lotes de 120 a 200 m² junto a Mall Montepinar, con más de 5,000 áreas verdes y un clima soleado casi todo el año. Un proyecto pensado para disfrutar el campo sin renunciar a la comodidad.',
    facts: [
      { value: '120 m²', label: 'Lote mínimo' },
      { value: '+5,000', label: 'Áreas verdes' },
      { value: '365', label: 'Días de sol' },
      { value: '42', label: 'Cuotas máximas' },
    ],
    amenities: [
      { icon: 'lucideStore', label: 'Mall Montepinar', text: 'Comercio y servicios cerca de tu lote.' },
      { icon: 'lucideSprout', label: 'Áreas verdes', text: 'Más de 5,000 áreas verdes para el descanso y la recreación.' },
      { icon: 'lucideSun', label: 'Clima soleado', text: 'Sol casi todo el año, ideal para el descanso.' },
      { icon: 'lucideShieldCheck', label: 'Acceso controlado', text: 'Ingreso con vigilancia y registro de visitas.' },
    ],
    gallery: [
      { src: '/images/AsociacionMontepinar.webp', alt: 'Vista aérea de las áreas deportivas' },
      { src: '/images/carousel/slide3.webp', alt: 'Áreas comunes' },
      { src: '/images/Entrada%20Montepinar%20entre%20jardines%20y%20banderas.webp', alt: 'Entrada entre jardines' },
      { src: '/images/carousel/entrada-palmeras.webp', alt: 'Vista del entorno' },
      { src: '/images/gallery/presentacion.webp', alt: 'Presentación del proyecto' },
    ],
    plans: plansFromSectors(HUARAL_SECTORS),
    sectors: HUARAL_SECTORS,
    dossier: '/documents/huaral/lista-de-precios-2026.pdf',
    priceListName: 'lista de precios del 25/05/2026',
    priceListNote: 'Lista de precios del 25/05/2026, en soles. Esquema no oficial y sin escala; la ubicación de los lotes es referencial. Sujeto a disponibilidad y a la validación del equipo comercial.',
    address: 'Asociación Vivienda Montepinar Lt, Carretera Panamericana Norte, Huacho',
    nearby: [
      { label: 'Centro de Huaral', distance: '10 min' },
      { label: 'Panamericana Norte', distance: '8 min' },
      { label: 'Puerto de Chancay', distance: '35 min' },
      { label: 'Lima', distance: '1 h 15 min' },
    ],
    financing: { minInitialPercent: 23, maxMonths: 42, annualRate: 0 },
    legal: [],
  },
  'amazon-lodge-montepinar': {
    tagline: 'Naturaleza viva a las puertas de la selva.',
    overview:
      'Amazon Lodge Montepinar es un proyecto eco-residencial con lotes generosos, laguna privada y bosque protegido. Un lugar para vivir cerca de la naturaleza con energía limpia y una comunidad que crece contigo.',
    facts: [
      { value: '450 m²', label: 'Lote mínimo' },
      { value: '1', label: 'Laguna privada' },
      { value: '100%', label: 'Eco-energía' },
      { value: '34', label: 'Cuotas máximas' },
    ],
    amenities: [
      { icon: 'lucideWaves', label: 'Laguna privada', text: 'Un espejo de agua para el descanso y la recreación.' },
      { icon: 'lucideTreePine', label: 'Bosque protegido', text: 'Áreas de conservación dentro del proyecto.' },
      { icon: 'lucideZap', label: 'Eco-energía', text: 'Sistemas de energía limpia para las áreas comunes.' },
      { icon: 'lucideUsers', label: 'Comunidad', text: 'Zonas sociales para compartir con tus vecinos.' },
    ],
    gallery: [
      { src: '/images/MontepinarIquitos.webp', alt: 'Recorrido de visitantes por el proyecto' },
      { src: '/images/carousel/slide2.webp', alt: 'Entorno natural' },
      { src: '/images/carousel/slide3.webp', alt: 'Áreas del proyecto' },
      { src: '/images/gallery/presentacion.webp', alt: 'Presentación del proyecto' },
      { src: '/images/carousel/entrada-palmeras.webp', alt: 'Vista del entorno' },
    ],
    plans: plansFromRows(IQUITOS_SECTORS, (row) =>
      row.location.startsWith('Mz A')
        ? { description: 'Lotes de 450 m² en las manzanas A, B y C: el precio más accesible del proyecto.', tag: 'Más accesible' }
        : { description: `${row.location}, de 450 m².` },
    ),
    sectors: IQUITOS_SECTORS,
    plansIntro: 'Lotes de 450 m² con el precio de la lista de Iquitos: contado, financiado, inicial y cuotas. Elige el tuyo en la sección siguiente.',
    priceListName: 'lista de precios de Iquitos',
    priceListNote: 'Lista de precios de Iquitos, en soles, para lotes de 450 m². El valor del terreno incluye memoria descriptiva y título notarial por acciones y derechos. La separación de un lote se realiza con S/ 500. El interesado costea su pasaje aéreo y coordina la visita. Sujeto a disponibilidad.',
    address: 'Iquitos, provincia de Maynas, Loreto',
    nearby: [
      { label: 'Aeropuerto de Iquitos', distance: '25 min' },
      { label: 'Centro de Iquitos', distance: '30 min' },
      { label: 'Río Nanay', distance: '15 min' },
      { label: 'Colegios y clínicas', distance: '25 min' },
    ],
    financing: { minInitialPercent: 21, maxMonths: 34, annualRate: 0 },
    legal: [],
  },
};

export function getProjectDetail(slug: string | null | undefined): ProjectDetail | undefined {
  const base = PROJECTS.find((project) => project.slug === slug);
  return base && slug ? { ...base, ...EXTRA[slug], legal: legalFor(slug) } : undefined;
}
