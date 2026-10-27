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
  { place: 'Av. Alfredo Mendiola 3683', reference: 'Al costado del BBVA o de la Notaría Gómez Verástegui', time: '8:30 am' },
  { place: 'Frente a Tottus Puente Piedra', time: '9:00 am' },
  { place: 'Paradero Fundición de Puente Piedra', time: '9:15 am' },
];

export const TOUR_INCLUSIONS: readonly TourInclusion[] = [
  { icon: 'lucideBus', title: 'Bus de ida y vuelta', text: 'Te recogemos en tu punto y te dejamos de regreso. Sin pagar pasajes.' },
  { icon: 'lucideUtensils', title: 'Desayuno y almuerzo', text: 'Te invitamos las dos comidas durante el día en el proyecto.' },
  { icon: 'lucidePresentation', title: 'Charla del proyecto', text: 'Te explicamos el proyecto y sus beneficios, con tiempo para tus preguntas.' },
  { icon: 'lucideFileSignature', title: 'Ayuda con el trámite', text: 'Si decides separar tu lote, te acompañamos con el pago y la firma del contrato.' },
];

export const TOUR_STEPS: readonly TourStep[] = [
  {
    number: '01',
    icon: 'lucideMapPin',
    title: 'Eliges tu punto de recojo',
    text: 'Reservas tu domingo y escoges dónde subir al bus: Av. Mendiola, frente a Tottus o paradero Fundición. Ahí te esperamos.',
    image: '/images/visita/transporte.png',
    imageAlt: 'Bus de la visita guiada con el asesor esperando en la puerta',
    contain: true,
  },
  {
    number: '02',
    icon: 'lucideBus',
    title: 'Viajamos juntos, gratis',
    text: 'El bus te recoge y te lleva al proyecto. El traslado no tiene costo, ni la ida ni la vuelta.',
    image: '/images/visita/bus-interior.png',
    imageAlt: 'Visitantes viajando en el bus con un asesor de Montepinar',
    position: '45% 50%',
  },
  {
    number: '03',
    icon: 'lucideCoffee',
    title: 'Llegada, desayuno y almuerzo',
    text: 'Al llegar te recibimos y te invitamos desayuno y almuerzo para que recorras con calma, sin apuros.',
    image: '/images/AsociacionMontepinar.webp',
    imageAlt: 'Ingreso principal de Montepinar',
  },
  {
    number: '04',
    icon: 'lucideMic',
    title: 'Charla del proyecto',
    text: 'Te explicamos cómo es Montepinar, qué incluye cada lote y cuáles son sus beneficios. Preguntas todas las que quieras.',
    image: '/images/visita/charla-mapas.png',
    imageAlt: 'Asesor explica el proyecto a los visitantes frente a los planos',
    position: '65% 50%',
  },
  {
    number: '05',
    icon: 'lucideLandPlot',
    title: 'Ves los lotes en vivo',
    text: 'Después de la charla caminamos el terreno juntos para que veas los lotes tal como son, no en un plano.',
    image: '/images/slide3.webp',
    imageAlt: 'Grupo de visitantes recorriendo el terreno con el plano',
    position: '30% 50%',
  },
  {
    number: '06',
    icon: 'lucideFileSignature',
    title: 'Separas tu lote con ayuda',
    text: 'Si te convence, te ayudamos con el trámite: pago de la separación y firma del contrato, todo en el mismo lugar.',
    image: '/images/visita/oficina.png',
    imageAlt: 'Asesora preparando los documentos de separación del lote',
    position: '45% 50%',
  },
  {
    number: '07',
    icon: 'lucideUndo2',
    title: 'Regresamos contigo',
    text: 'Cerramos el día y el bus te lleva de vuelta al mismo punto donde subiste.',
    image: '/images/entrada.png',
    imageAlt: 'Entrada de Montepinar',
  },
];
