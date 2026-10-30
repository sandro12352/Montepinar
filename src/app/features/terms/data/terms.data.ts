export interface TermsSection {
  readonly title: string;
  readonly paragraphs: readonly string[];
}

export const TERMS_UPDATED = 'Octubre 2026';

// Texto base: debe ser revisado y aprobado por el asesor legal de Montepinar antes de publicarse.
export const TERMS_SECTIONS: readonly TermsSection[] = [
  {
    title: 'Uso del sitio web',
    paragraphs: [
      'Este sitio presenta los proyectos inmobiliarios de Montepinar con fines informativos. Al navegarlo aceptas estos términos.',
      'Los contenidos, imágenes y marcas pertenecen a Montepinar y no pueden reproducirse sin autorización.',
    ],
  },
  {
    title: 'Información de los proyectos',
    paragraphs: [
      'Los precios, áreas, planos, imágenes referenciales y condiciones de pago pueden cambiar sin previo aviso y están sujetos a disponibilidad.',
      'La información publicada no constituye una oferta vinculante. Las condiciones finales se establecen en el contrato de compraventa.',
    ],
  },
  {
    title: 'Visitas guiadas',
    paragraphs: [
      'Las visitas se realizan los sábados y domingos, salvo feriados, y no tienen costo. Incluyen traslado en bus y desayuno.',
      'La reserva depende de la disponibilidad de cupos. Montepinar puede reprogramar una visita por motivos de fuerza mayor y te avisará con anticipación.',
    ],
  },
  {
    title: 'Separación y compra de lotes',
    paragraphs: [
      'La separación de un lote y la compraventa se formalizan únicamente mediante los documentos y pagos acordados con un asesor de Montepinar.',
      'Antes de pagar, puedes revisar la documentación legal de cada proyecto en la sección Información legal.',
    ],
  },
  {
    title: 'Datos personales',
    paragraphs: [
      'Los datos que nos compartes en los formularios se usan solo para contactarte y gestionar tu visita o consulta.',
      'Puedes solicitar la actualización o eliminación de tus datos escribiéndonos por los canales de contacto.',
    ],
  },
  {
    title: 'Contacto',
    paragraphs: ['Si tienes dudas sobre estos términos, escríbenos por WhatsApp o visítanos en nuestra oficina.'],
  },
];
