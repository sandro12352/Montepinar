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
  role: 'Fundador y director general',
  quote: 'Queremos que cada familia sienta que compró un lugar, no solo un terreno.',
  photo: '/images/dueño.png',
};

export const TEAM_MEMBERS: readonly TeamMember[] = [
  { role: 'Asesora inmobiliaria', name: 'Jesús Chavela Saucedo Arteaga', focus: 'Te acompaña a elegir tu lote y tu plan de pago en MontePinar.', icon: 'lucideHandshake', photos: ['/images/equipo/chavela-saucedo-3.png', '/images/equipo/chavela-saucedo-5.png'] },
  { role: 'Asesor inmobiliario', name: 'Zandro Ricardo Quispe Rojas', focus: 'Te orienta en cada paso para invertir en tu lote con confianza.', icon: 'lucideScale', photos: ['/images/equipo/jose-maria-varillas-4.png', '/images/equipo/jose-maria-varillas-3.png'] },
  { role: 'Asesora inmobiliaria', name: 'Hillma Machuca Díaz', focus: 'Te asesora de principio a fin en Montepinar Inmobiliaria y Constructora.', icon: 'lucideHardHat', photos: ['/images/equipo/hillma-machuca-2.png', '/images/equipo/hillma-machuca-3.png'] },
  { role: 'Comunicador social', name: 'Miguel Salgado Salesi', focus: 'Apasionado por el deporte y por servir a las personas.', icon: 'lucideHeadset', photos: ['/images/equipo/miguel-salgado-3.png', '/images/equipo/miguel-salgado-2.png'] },
];
