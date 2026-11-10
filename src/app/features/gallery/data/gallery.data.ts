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
  { src: '/images/about/Familia contemplando el valle al atardecer.webp', alt: 'Una familia contempla el valle al atardecer', category: 'proyecto' },
  { src: '/images/gallery/terreno-cabanas.webp', alt: 'Terreno de Montepinar con módulos de obra y las montañas al fondo', category: 'proyecto' },
  { src: '/images/gallery/casa-jardin.webp', alt: 'Casa de un propietario con jardín y tanque de agua', category: 'clientes' },
  { src: '/images/gallery/presentacion.webp', alt: 'Presentación del plano y las etapas del proyecto Montepinar', category: 'nosotros' },
  { src: '/images/gallery/modulos-colores.webp', alt: 'Hilera de módulos de colores junto a una vía del proyecto', category: 'proyecto' },
  { src: '/images/about/Visita de terrenos en el desierto.webp', alt: 'Familias recorren el terreno con el plano en mano', category: 'visitas' },
  { src: '/images/gallery/casa-verde.webp', alt: 'Casa verde con terraza construida por un propietario', category: 'clientes' },
  { src: '/images/gallery/foto-grupal-mapa.webp', alt: 'Clientes posando junto al plano de lotes de Montepinar', category: 'clientes' },
  { src: '/images/about/Revisión colaborativa del plan urbanístico.webp', alt: 'Un asesor muestra los lotes sobre el plano del proyecto', category: 'nosotros' },
  { src: '/images/gallery/bus-llegada.webp', alt: 'Bus de la visita llegando al módulo de atención de Montepinar', category: 'visitas' },
  { src: '/images/gallery/modulos-turquesa.webp', alt: 'Vista amplia de los módulos de los propietarios en el terreno', category: 'proyecto' },
  { src: '/images/about/Casa rural entre nubes y desierto.webp', alt: 'Casa construida en un lote de Montepinar', category: 'clientes' },
  { src: '/images/gallery/home/cartel-mall.webp', alt: 'Cartel del futuro Montepinar Mall, Sector 2 Etapa 2', category: 'proyecto' },
  { src: '/images/gallery/equipo-mapa.webp', alt: 'El equipo de Montepinar explicando el plano de etapas y lotes', category: 'nosotros' },
  { src: '/images/gallery/visita-ingreso.webp', alt: 'Visitantes atentos a la explicación en el ingreso del proyecto', category: 'visitas' },
  { src: '/images/about/Familia contempla comunidad al amanecer.webp', alt: 'Una familia mira su comunidad al amanecer', category: 'proyecto' },
  { src: '/images/gallery/home/mercado.webp', alt: 'Recreación del futuro Mercado de Montepinar, Sector 4 Etapa 2', category: 'proyecto' },
  { src: '/images/gallery/atencion-oficina.webp', alt: 'Asesora atendiendo a clientes en la oficina de Montepinar', category: 'nosotros' },
  { src: '/images/gallery/grupo-entrada.webp', alt: 'Grupo de visitantes junto al módulo de ingreso de Montepinar', category: 'visitas' },
  { src: '/images/about/Firma de registro en mesa de cristal.webp', alt: 'Una clienta firma su ficha de registro', category: 'clientes' },
  { src: '/images/gallery/home/bus-recojo.webp', alt: 'Bus de la visita guiada con los asesores esperando en el punto de recojo', category: 'visitas' },
  { src: '/images/gallery/cliente-promocion.webp', alt: 'Clienta con el brochure frente al panel de Montepinar Inmobiliaria & Constructora', category: 'clientes' },
  { src: '/images/about/Conversación intensa en la sala de espera.webp', alt: 'Una asesora conversa con clientas sobre las opciones de compra', category: 'nosotros' },
  { src: '/images/visita/recorrido-planos.webp', alt: 'Recorrido del terreno con los planos del proyecto', category: 'visitas' },
  { src: '/images/visita/supervisor-quad.webp', alt: 'Supervisor recorriendo el proyecto en cuatrimoto', category: 'visitas' },
  { src: '/images/visita/charla-vecinal.webp', alt: 'Charla con vecinos y propietarios del proyecto', category: 'clientes' },
  { src: '/images/visita/reunion-ventas.webp', alt: 'Reunión con el equipo de ventas', category: 'nosotros' },
  { src: '/images/visita/guia-anunciando.webp', alt: 'Guía de la visita dando indicaciones al grupo', category: 'visitas' },
  { src: '/images/visita/visita-mar.webp', alt: 'Visita al proyecto con vista al mar', category: 'visitas' },
  { src: '/images/visita/visita-desierto-mapas.webp', alt: 'Visitantes con mapas en el terreno del proyecto', category: 'visitas' },
];
