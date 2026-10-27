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
  { role: 'Gerencia comercial', name: 'Nombre y apellido', focus: 'Te acompaña a elegir tu lote y tu plan de pago.', icon: 'lucideHandshake', photos: ['/images/equipo/chavela-saucedo-3.png', '/images/equipo/chavela-saucedo-5.png'] },
  { role: 'Asesoría legal', name: 'Nombre y apellido', focus: 'Cuida que cada documento esté claro y en regla.', icon: 'lucideScale', photos: ['/images/equipo/jose-maria-varillas-4.png', '/images/equipo/jose-maria-varillas-3.png'] },
  { role: 'Jefatura de obras', name: 'Nombre y apellido', focus: 'Supervisa el avance y la calidad en el terreno.', icon: 'lucideHardHat', photos: ['/images/equipo/hillma-machuca-2.png', '/images/equipo/hillma-machuca-3.png'] },
  { role: 'Atención al cliente', name: 'Nombre y apellido', focus: 'Resuelve tus dudas antes y después de comprar.', icon: 'lucideHeadset', photos: ['/images/equipo/miguel-salgado-3.png', '/images/equipo/miguel-salgado-2.png'] },
];
