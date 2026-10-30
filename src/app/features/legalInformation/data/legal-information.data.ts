export interface LegalDocument {
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  /** Ruta del PDF en /public/documents. Mientras falte, la tarjeta se muestra como "Próximamente". */
  readonly file?: string;
}

export interface LegalProject {
  readonly slug: string;
  readonly name: string;
  readonly location: string;
  readonly documents: readonly LegalDocument[];
}

const MONTEPINAR_DOCUMENTS: readonly LegalDocument[] = [
  { title: 'Partida Registral', description: 'Inscripción del terreno en Registros Públicos a nombre de la asociación.', icon: 'lucideLandmark' },
  { title: 'Habilitación Urbana', description: 'Aprobación municipal para convertir el terreno en lotes con servicios.', icon: 'lucideBuilding2' },
  { title: 'Estudio de suelos', description: 'Análisis técnico de la resistencia y composición del terreno.', icon: 'lucideLayers' },
  { title: 'Cambio de Uso', description: 'Autorización para destinar el terreno a uso residencial.', icon: 'lucideRefreshCw' },
  { title: 'Declaración Jurada Autovalúo', description: 'Declaración del predio ante la municipalidad para el pago de tributos.', icon: 'lucideFileSignature' },
  { title: 'Constancia de No Adeudo', description: 'Certifica que el predio no mantiene deudas pendientes.', icon: 'lucideBadgeCheck' },
  { title: 'Partida — Compra a la Comunidad Campesina', description: 'Respaldo de la adquisición del terreno a la comunidad campesina.', icon: 'lucideHandshake' },
  { title: 'Partida — 50163042', description: 'Partida registral matriz del predio, número 50163042.', icon: 'lucideFileText' },
  { title: 'Aprobación del ANA', description: 'Conformidad de la Autoridad Nacional del Agua sobre el predio.', icon: 'lucideDroplets' },
];

// Los demás proyectos aún no tienen documentos cargados: se completan igual que el de Huaral.
export const LEGAL_PROJECTS: readonly LegalProject[] = [
  { slug: 'chancay', name: 'Palmeras de Montepinar', location: 'Chancay', documents: [] },
  { slug: 'huaral', name: 'Asociación Montepinar', location: 'Huaral', documents: MONTEPINAR_DOCUMENTS },
  { slug: 'iquitos', name: 'Amazon Lodge Montepinar', location: 'Iquitos', documents: [] },
];
