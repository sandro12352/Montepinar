export interface LegalDocument {
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  /** Ruta del PDF en /public/documents. Solo se listan los documentos que ya están cargados. */
  readonly file?: string;
}

export interface LegalProject {
  readonly slug: string;
  readonly name: string;
  readonly location: string;
  readonly documents: readonly LegalDocument[];
}

const MONTEPINAR_DOCUMENTS: readonly LegalDocument[] = [
  { title: 'Partida Registral', description: 'Partida registral matriz del predio, número 50163042, inscrita en Registros Públicos.', icon: 'lucideLandmark', file: '/documents/asociacion-de-vivienda-montepinar/partida-50163042.pdf' },
  { title: 'Partida Registral — Compra a la Comunidad Campesina', description: 'Respaldo de la adquisición del terreno a la comunidad campesina.', icon: 'lucideHandshake', file: '/documents/asociacion-de-vivienda-montepinar/partida-compra-comunidad.pdf' },
  { title: 'Vigencia de la Asociación', description: 'Documento que acredita la vigencia de la Asociación de Vivienda Montepinar.', icon: 'lucideBadgeCheck', file: '/documents/asociacion-de-vivienda-montepinar/vigencia-asociacion.pdf' },
  { title: 'Planeamiento Integral', description: 'Plano aprobado que ordena las vías, manzanas, lotes y áreas de aporte del proyecto.', icon: 'lucideMap', file: '/documents/asociacion-de-vivienda-montepinar/planeamiento-integral.pdf' },
  { title: 'Certificado de Parámetros Urbanísticos', description: 'Zonificación y parámetros edificatorios del predio, emitido por la Municipalidad Provincial de Huaura.', icon: 'lucideScrollText', file: '/documents/asociacion-de-vivienda-montepinar/certificado-parametros-urbanisticos.pdf' },
  { title: 'Aprobación del ANA', description: 'Conformidad de la Autoridad Nacional del Agua sobre el predio.', icon: 'lucideDroplets', file: '/documents/asociacion-de-vivienda-montepinar/aprobacion-ana.pdf' },
  { title: 'Declaración Jurada Autovalúo', description: 'Declaración del predio ante la municipalidad para el pago de tributos.', icon: 'lucideFileSignature', file: '/documents/asociacion-de-vivienda-montepinar/declaracion-jurada-autovaluo.pdf' },
];

const PALMERAS_DOCUMENTS: readonly LegalDocument[] = [
  { title: 'Vigencia de la Inmobiliaria', description: 'Documento que acredita la vigencia de Montepinar Inversiones Inmobiliarias y Constructora.', icon: 'lucideBadgeCheck', file: '/documents/palmeras-de-montepinar/vigencia-inmobiliaria.pdf' },
  { title: 'Planeamiento Integral', description: 'Plano aprobado que ordena las vías, manzanas, lotes y áreas de aporte del proyecto.', icon: 'lucideMap', file: '/documents/palmeras-de-montepinar/planeamiento-integral.pdf' },
  { title: 'CIRA — Área 1', description: 'Certificado de Inexistencia de Restos Arqueológicos en superficie del Área 1 de Palmeras de Montepinar.', icon: 'lucideLandmark', file: '/documents/palmeras-de-montepinar/cira-area-1.pdf' },
  { title: 'CIRA — Área 2', description: 'Certificado de Inexistencia de Restos Arqueológicos en superficie del Área 2 de Palmeras de Montepinar.', icon: 'lucideLandmark', file: '/documents/palmeras-de-montepinar/cira-area-2.pdf' },
  { title: 'CIRA — Área 3', description: 'Certificado de Inexistencia de Restos Arqueológicos en superficie del Área 3 de Palmeras de Montepinar.', icon: 'lucideLandmark', file: '/documents/palmeras-de-montepinar/cira-area-3.pdf' },
  { title: 'Aprobación del ANA', description: 'Conformidad de la Autoridad Nacional del Agua sobre el predio.', icon: 'lucideDroplets', file: '/documents/palmeras-de-montepinar/aprobacion-ana.pdf' },
  { title: 'Declaración Jurada Autovalúo', description: 'Declaración del predio ante la municipalidad para el pago de tributos.', icon: 'lucideFileSignature', file: '/documents/palmeras-de-montepinar/declaracion-jurada-autovaluo.pdf' },
];

// Iquitos aún no tiene documentos cargados: se completa igual que los demás.
export const LEGAL_PROJECTS: readonly LegalProject[] = [
  { slug: 'palmeras-de-montepinar', name: 'Palmeras de Montepinar', location: 'Huacho', documents: PALMERAS_DOCUMENTS },
  { slug: 'asociacion-de-vivienda-montepinar', name: 'Asociación de Vivienda Montepinar', location: 'Huacho', documents: MONTEPINAR_DOCUMENTS },
  { slug: 'amazon-lodge-montepinar', name: 'Amazon Lodge Montepinar', location: 'Iquitos', documents: [] },
];
