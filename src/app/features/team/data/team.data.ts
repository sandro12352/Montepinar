export interface TeamMember {
  readonly role: string;
  readonly name: string;
  /** Qué hace esta persona por el cliente, en una línea. */
  readonly focus: string;
  readonly icon: string;
  /** Fotos del integrante; al pasar el mouse se alterna a la siguiente. Si faltan, se muestra un ícono del área. */
  readonly photos?: readonly string[];
}

export interface TeamFounder {
  readonly name: string;
  readonly role: string;
  readonly quote: string;
  readonly photo: string;
}

// Los nombres son marcadores: reemplázalos por los reales y agrega `photo` con la ruta de cada foto.
export const TEAM_FOUNDER: TeamFounder = {
  name: 'Nombre del fundador',
  role: 'Fundador de Montepinar',
  quote: 'Queremos que cada familia sienta que compró un lugar, no solo un terreno.',
  photo: '/images/about/dueno.webp',
};

export const TEAM_MEMBERS: readonly TeamMember[] = [
  { role: 'Asesora inmobiliaria', name: 'Carla Ceraldine Cantu Calderón', focus: 'Te guía con calidez para encontrar el lote ideal y el plan de pago que se ajuste a ti.', icon: 'lucideHandshake', photos: ['/images/equipo/susana-nieto-2.webp', '/images/equipo/susana-nieto-1.webp'] },
  { role: 'Asesora inmobiliaria', name: 'Susana Nieto Saldaña', focus: 'Resuelve tus dudas y te acompaña en cada paso, desde la visita hasta la firma.', icon: 'lucideScale', photos: ['/images/equipo/carla-cantu-2.webp', '/images/equipo/carla-cantu-1.webp'] },
  { role: 'Comunicador social', name: 'Miguel Salgado Salesi', focus: 'Apasionado por el deporte y por servir a las personas.', icon: 'lucideHeadset', photos: ['/images/equipo/miguel-salgado-3.webp', '/images/equipo/miguel-salgado-2.webp'] },
  { role: 'Asesora inmobiliaria', name: 'Hillma Machuca Díaz', focus: 'Te asesora de principio a fin en Montepinar Inmobiliaria y Constructora.', icon: 'lucideHardHat', photos: ['/images/equipo/hillma-machuca-2.webp', '/images/equipo/hillma-machuca-3.webp'] },
];
