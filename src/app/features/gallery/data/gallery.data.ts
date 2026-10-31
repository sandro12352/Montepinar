export type GalleryCategory = 'proyecto' | 'visitas' | 'clientes' | 'nosotros';

export interface GalleryPhoto {
  readonly src: string;
  readonly alt: string;
  readonly category: GalleryCategory;
}

export const GALLERY_FILTERS: readonly { readonly id: 'todas' | GalleryCategory; readonly label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'proyecto', label: 'Proyecto' },
  { id: 'visitas', label: 'Visitas guiadas' },
  { id: 'clientes', label: 'Clientes' },
  { id: 'nosotros', label: 'Nosotros' },
];

export const GALLERY_PHOTOS: readonly GalleryPhoto[] = [
  { src: '/images/about/Familia contemplando el valle al atardecer.png', alt: 'Una familia contempla el valle al atardecer', category: 'proyecto' },
  { src: '/images/gallery/terreno-cabanas.png', alt: 'Terreno de Montepinar con módulos de obra y las montañas al fondo', category: 'proyecto' },
  { src: '/images/gallery/casa-jardin.png', alt: 'Casa de un propietario con jardín y tanque de agua', category: 'clientes' },
  { src: '/images/gallery/presentacion.webp', alt: 'Presentación del plano y las etapas del proyecto Montepinar', category: 'nosotros' },
  { src: '/images/gallery/modulos-colores.png', alt: 'Hilera de módulos de colores junto a una vía del proyecto', category: 'proyecto' },
  { src: '/images/about/Visita de terrenos en el desierto.png', alt: 'Familias recorren el terreno con el plano en mano', category: 'visitas' },
  { src: '/images/gallery/casa-verde.png', alt: 'Casa verde con terraza construida por un propietario', category: 'clientes' },
  { src: '/images/gallery/foto-grupal-mapa.png', alt: 'Clientes posando junto al plano de lotes de Montepinar', category: 'clientes' },
  { src: '/images/about/Revisión colaborativa del plan urbanístico.png', alt: 'Un asesor muestra los lotes sobre el plano del proyecto', category: 'nosotros' },
  { src: '/images/gallery/bus-llegada.png', alt: 'Bus de la visita llegando al módulo de atención de Montepinar', category: 'visitas' },
  { src: '/images/gallery/modulos-turquesa.png', alt: 'Vista amplia de los módulos de los propietarios en el terreno', category: 'proyecto' },
  { src: '/images/about/Casa rural entre nubes y desierto.png', alt: 'Casa construida en un lote de Montepinar', category: 'clientes' },
  { src: '/images/gallery/cartel-mall.png', alt: 'Cartel del futuro Montepinar Mall, Sector 2 Etapa 2', category: 'proyecto' },
  { src: '/images/gallery/equipo-mapa.png', alt: 'El equipo de Montepinar explicando el plano de etapas y lotes', category: 'nosotros' },
  { src: '/images/gallery/visita-ingreso.png', alt: 'Visitantes atentos a la explicación en el ingreso del proyecto', category: 'visitas' },
  { src: '/images/about/Familia contempla comunidad al amanecer.png', alt: 'Una familia mira su comunidad al amanecer', category: 'proyecto' },
  { src: '/images/gallery/mercado.png', alt: 'Recreación del futuro Mercado de Montepinar, Sector 4 Etapa 2', category: 'proyecto' },
  { src: '/images/gallery/atencion-oficina.png', alt: 'Asesora atendiendo a clientes en la oficina de Montepinar', category: 'nosotros' },
  { src: '/images/gallery/grupo-entrada.png', alt: 'Grupo de visitantes junto al módulo de ingreso de Montepinar', category: 'visitas' },
  { src: '/images/about/Firma de registro en mesa de cristal.png', alt: 'Una clienta firma su ficha de registro', category: 'clientes' },
  { src: '/images/gallery/bus-recojo.png', alt: 'Bus de la visita guiada con los asesores esperando en el punto de recojo', category: 'visitas' },
  { src: '/images/gallery/cliente-promocion.png', alt: 'Clienta con el brochure frente al panel de Montepinar Inmobiliaria & Constructora', category: 'clientes' },
  { src: '/images/about/Conversación intensa en la sala de espera.png', alt: 'Una asesora conversa con clientas sobre las opciones de compra', category: 'nosotros' },
  { src: '/images/visita/recorrido-planos.png', alt: 'Recorrido del terreno con los planos del proyecto', category: 'visitas' },
  { src: '/images/visita/supervisor-quad.png', alt: 'Supervisor recorriendo el proyecto en cuatrimoto', category: 'visitas' },
  { src: '/images/visita/charla-vecinal.png', alt: 'Charla con vecinos y propietarios del proyecto', category: 'clientes' },
  { src: '/images/visita/reunion-ventas.png', alt: 'Reunión con el equipo de ventas', category: 'nosotros' },
  { src: '/images/visita/guia-anunciando.png', alt: 'Guía de la visita dando indicaciones al grupo', category: 'visitas' },
  { src: '/images/visita/visita-mar.png', alt: 'Visita al proyecto con vista al mar', category: 'visitas' },
  { src: '/images/visita/visita-desierto-mapas.png', alt: 'Visitantes con mapas en el terreno del proyecto', category: 'visitas' },
];
