export interface PickupPoint {
  readonly place: string;
  readonly reference?: string;
  readonly time: string;
}

export interface TourStep {
  readonly number: string;
  readonly icon: string;
  readonly title: string;
  readonly text: string;
  readonly image: string;
  readonly imageAlt: string;
  /** Posición del encuadre de la foto dentro del arco (object-position). */
  readonly position?: string;
  /** PNG recortado: se muestra completo, apoyado abajo, en lugar de llenar el arco. */
  readonly contain?: boolean;
}

export interface TourInclusion {
  readonly icon: string;
  readonly title: string;
  readonly text: string;
}

export const PICKUP_POINTS: readonly PickupPoint[] = [
  { place: 'Av. Alfredo Mendiola 3683', reference: 'Al costado del BBVA o de la Notaría Gómez Verástegui', time: '8:15 am' },
  { place: 'Frente a Tottus Puente Piedra', time: '9:00 am' },
  { place: 'Paradero Fundición de Puente Piedra', time: '9:15 am' },
];

export const TOUR_INCLUSIONS: readonly TourInclusion[] = [
  { icon: 'lucideBus', title: 'Bus de ida y vuelta', text: 'Te recogemos en tu punto y te dejamos de regreso. Sin pagar pasajes.' },
  { icon: 'lucideUtensils', title: 'Desayuno incluido', text: 'Después del recorrido te invitamos el desayuno en el proyecto.' },
  { icon: 'lucidePresentation', title: 'Charla del proyecto', text: 'Te explicamos el proyecto y sus beneficios, con tiempo para tus preguntas.' },
  { icon: 'lucideFileSignature', title: 'Ayuda con el trámite', text: 'Si decides separar tu lote, te acompañamos con el pago y la firma del contrato.' },
];

export const TOUR_STEPS: readonly TourStep[] = [
  {
    number: '01',
    icon: 'lucideBus',
    title: 'Subes al bus, gratis',
    text: 'Reservas tu sábado o domingo y escoges dónde subir: Av. Mendiola, frente a Tottus o paradero Fundición. El traslado no tiene costo.',
    image: '/images/visita/transporte.png',
    imageAlt: 'Bus de la visita guiada con el asesor esperando en la puerta',
    contain: true,
  },
  {
    number: '02',
    icon: 'lucideLandPlot',
    title: 'Recorremos el proyecto',
    text: 'Al llegar caminamos el terreno juntos para que veas los lotes tal como son, no en un plano.',
    image: '/images/visita/recorrido-planos.png',
    imageAlt: 'Visitantes revisando el plano de lotes frente al edificio del proyecto',
    position: '55% 40%',
  },
  {
    number: '03',
    icon: 'lucideCoffee',
    title: 'Desayuno',
    text: 'Después del recorrido te invitamos un desayuno para que descanses y converses con calma.',
    image: '/images/visita/orientacion-recepcion.png',
    imageAlt: 'Asesora atiende a los visitantes en el salón de recepción',
    position: '40% 50%',
  },
  {
    number: '04',
    icon: 'lucideMic',
    title: 'Charla del proyecto',
    text: 'Te explicamos cómo es Montepinar, qué incluye cada lote y cuáles son sus beneficios. Preguntas todas las que quieras.',
    image: '/images/visita/charla-vecinal.png',
    imageAlt: 'Visitantes atentos a la charla del proyecto frente a los planos de Montepinar',
    position: '50% 50%',
  },
  {
    number: '05',
    icon: 'lucideFileSignature',
    title: 'Te ayudamos con el trámite',
    text: 'Si te convence, te ayudamos con el trámite: pago de la separación y firma del contrato, todo en el mismo lugar.',
    image: '/images/visita/reunion-ventas.png',
    imageAlt: 'Asesora completa los documentos de separación del lote junto a una pareja de clientes',
    position: '45% 50%',
  },
];

export interface TourPhoto {
  readonly image: string;
  readonly alt: string;
  readonly caption: string;
  /** Clases de rejilla que definen el tamaño de la foto dentro del mosaico. */
  readonly span: string;
  readonly position?: string;
}

export const TOUR_PHOTOS: readonly TourPhoto[] = [
  {
    image: '/images/visita/supervisor-quad.png',
    alt: 'Supervisor de Montepinar junto a un cuatrimoto en las vías del proyecto',
    caption: 'Un equipo que conoce cada rincón del terreno',
    span: 'col-span-2 row-span-2 md:col-span-4',
    position: '50% 60%',
  },
  {
    image: '/images/visita/guardias-ingreso.png',
    alt: 'Dos guardias de seguridad frente a la reja del ingreso',
    caption: 'Ingreso con seguridad',
    span: 'col-span-1 md:col-span-2',
    position: '50% 55%',
  },
  {
    image: '/images/visita/guia-anunciando.png',
    alt: 'Guía de Montepinar explicando el proyecto con un micrófono',
    caption: 'Te explicamos en el lugar',
    span: 'col-span-1 md:col-span-2',
    position: '50% 40%',
  },
  {
    image: '/images/visita/firma-documentos.png',
    alt: 'Cliente firmando el formulario de separación de su lote',
    caption: 'Separas con acompañamiento',
    span: 'col-span-1 md:col-span-2',
    position: '65% 50%',
  },
  {
    image: '/images/visita/bus-interior.png',
    alt: 'Visitantes viajando en el bus con un asesor de Montepinar',
    caption: 'Viajamos juntos, ida y vuelta',
    span: 'col-span-1 md:col-span-2',
    position: '45% 50%',
  },
  {
    image: '/images/visita/charla-mapas.png',
    alt: 'Asesor explica el proyecto a los visitantes frente a los planos',
    caption: 'Resolvemos todas tus preguntas',
    span: 'col-span-2 md:col-span-2',
    position: '65% 50%',
  },
];
