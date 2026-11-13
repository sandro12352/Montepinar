/**
 * Artículos del blog. Para publicar uno nuevo: agregarlo a BLOG_POSTS y a public/sitemap.xml.
 * El slug es la URL (/blog/<slug>) y no debe cambiar una vez publicado.
 *
 * ESTADO: borradores escritos solo con datos que ya muestra el sitio (proyectos, información legal,
 * visita guiada). La empresa debe revisarlos antes de publicar: en un blog, todo dato sale tal cual en Google.
 * Las imágenes viven en public/images/blog (portada 1200×630 en WebP y JPG para compartir).
 */
export interface BlogSection {
  readonly heading: string;
  readonly paragraphs: readonly string[];
  readonly bullets?: readonly string[];
}

export interface BlogLink {
  readonly label: string;
  readonly path: string;
}

export interface BlogPost {
  readonly slug: string;
  /** Título para Google y la pestaña (hasta ~60 caracteres). */
  readonly seoTitle: string;
  /** Descripción para Google y al compartir (120–160 caracteres). */
  readonly seoDescription: string;
  /** Título visible (h1) del artículo. */
  readonly title: string;
  /** Resumen corto para el listado del blog. */
  readonly excerpt: string;
  readonly category: string;
  /** Fechas en formato AAAA-MM-DD. */
  readonly datePublished: string;
  readonly dateModified: string;
  readonly readingMinutes: number;
  /** Portada 1200×630 (WebP) para el listado y el artículo. */
  readonly image: string;
  /** Misma portada en JPG, que es el formato más seguro para compartir en redes. */
  readonly ogImage: string;
  readonly imageAlt: string;
  readonly intro: readonly string[];
  readonly sections: readonly BlogSection[];
  /** Enlaces internos al final del artículo (proyectos, visita guiada, información legal). */
  readonly links: readonly BlogLink[];
}

export const BLOG_POSTS: readonly BlogPost[] = [
  {
    slug: 'como-comprar-un-lote-en-huacho',
    seoTitle: 'Cómo comprar un lote en Huacho paso a paso | Montepinar',
    seoDescription:
      'Guía para comprar un lote en Huacho: cómo elegir tamaño y ubicación, qué documentos revisar, cómo visitar el proyecto y separar tu lote con acompañamiento.',
    title: 'Cómo comprar un lote en Huacho: guía paso a paso',
    excerpt:
      'Qué debes definir antes de comprar, qué revisar en la visita y en los documentos, y cómo separar tu lote sin sorpresas.',
    category: 'Guía de compra',
    datePublished: '2026-11-13',
    dateModified: '2026-11-13',
    readingMinutes: 5,
    image: '/images/blog/entrada-palmeras-de-montepinar-portada.webp',
    ogImage: '/images/blog/entrada-palmeras-de-montepinar-portada.jpg',
    imageAlt: 'Entrada de Palmeras de Montepinar con banderas, palmeras y cerros al fondo',
    intro: [
      'Comprar un lote es una de las decisiones más importantes que vas a tomar, y no tiene por qué ser complicada. Con un orden claro y los documentos a la vista, puedes decidir con tranquilidad.',
      'Esta guía resume los pasos que recomendamos seguir si estás pensando en comprar un lote en Huacho, desde definir lo que necesitas hasta recibir tu terreno.',
    ],
    sections: [
      {
        heading: '1. Define qué lote necesitas',
        paragraphs: [
          'Antes de mirar proyectos, piensa para qué quieres el lote: construir tu casa, tener un terreno de campo o invertir a largo plazo. Eso te ayuda a decidir el tamaño y la ubicación.',
        ],
        bullets: [
          'Tamaño: en Palmeras de Montepinar hay lotes de 120 m² a 1,000 m², y en la Asociación de Vivienda Montepinar, de 120 m² a 200 m².',
          'Presupuesto: calcula cuánto puedes pagar de inicial y de cuota mensual, y no solo el precio total del lote.',
          'Ubicación: revisa los accesos, el transporte y los servicios de la zona.',
        ],
      },
      {
        heading: '2. Visita el proyecto en persona',
        paragraphs: [
          'Las fotos y los planos ayudan, pero ver el terreno cambia la decisión. En una visita guiada de Montepinar hay bus de ida y vuelta desde Lima, desayuno, charla del proyecto y ayuda con el trámite si decides separar tu lote.',
          'Aprovecha la visita para hacer preguntas: cómo está la zona, qué obras hay en marcha y qué lotes están disponibles.',
        ],
      },
      {
        heading: '3. Revisa la documentación legal',
        paragraphs: [
          'Antes de pagar, pide los documentos del terreno y comprueba que estén vigentes. Los principales son:',
        ],
        bullets: [
          'Partida registral del predio, inscrita en Registros Públicos.',
          'Planeamiento integral aprobado: el plano que ordena las vías, manzanas y lotes.',
          'Certificado de parámetros urbanísticos: la zonificación y lo que se puede construir.',
          'Autorizaciones del terreno, como la conformidad de la Autoridad Nacional del Agua (ANA) y el certificado de inexistencia de restos arqueológicos (CIRA).',
        ],
      },
      {
        heading: '4. Compara las opciones de pago',
        paragraphs: [
          'Pregunta si el lote se paga al contado o en cuotas, cuánto es la inicial, si hay intereses y qué pasa si te atrasas o decides retirarte. Pide que todo quede escrito en el contrato.',
          'Montepinar ofrece trato directo, sin exigir garantía de pago. Consulta con un asesor los montos y condiciones vigentes para el lote que te interesa.',
        ],
      },
      {
        heading: '5. Separa tu lote y firma el contrato',
        paragraphs: [
          'Un asesor te guía en la separación y en la documentación. Antes de firmar, lee el contrato completo y comprueba los datos del lote (manzana, número y área), el precio, la forma de pago, los plazos y las condiciones de devolución.',
        ],
      },
      {
        heading: '6. Recibe tu lote y empieza a planificar',
        paragraphs: [
          'Con el contrato firmado, recibes tu lote y puedes empezar a planificar tu construcción. Conviene acercarte a un arquitecto o ingeniero para definir cómo aprovechar el terreno.',
        ],
      },
    ],
    links: [
      { label: 'Agenda una visita guiada', path: '/visita-guiada' },
      { label: 'Consulta la información legal de los proyectos', path: '/informacion-legal' },
      { label: 'Conoce los proyectos de lotes', path: '/proyectos' },
    ],
  },
  {
    slug: 'documentos-para-comprar-un-terreno',
    seoTitle: 'Qué documentos pedir al comprar un terreno | Montepinar',
    seoDescription:
      'Lista de documentos que debes pedir antes de comprar un terreno o lote: partida registral, parámetros urbanísticos, planeamiento integral y más. Evita estafas.',
    title: 'Qué documentos pedir al comprar un terreno',
    excerpt:
      'La lista de documentos que conviene revisar antes de pagar un lote, y las señales de alerta que debes tener presentes.',
    category: 'Documentos y seguridad',
    datePublished: '2026-11-13',
    dateModified: '2026-11-13',
    readingMinutes: 5,
    image: '/images/blog/visitantes-ante-el-plano-de-etapas-portada.webp',
    ogImage: '/images/blog/visitantes-ante-el-plano-de-etapas-portada.jpg',
    imageAlt: 'Visitantes observan el plano de lotes y las etapas del proyecto Montepinar',
    intro: [
      'Muchas personas compran un terreno guiándose solo por las fotos o por lo que les dice el vendedor. Pedir los documentos antes de pagar es la mejor forma de comprar con seguridad.',
      'Esta es la lista de lo que conviene revisar. Si tienes dudas, un abogado o un notario puede revisar los documentos contigo antes de que firmes.',
    ],
    sections: [
      {
        heading: 'Partida registral',
        paragraphs: [
          'Es la ficha del predio en Registros Públicos. Te dice quién es el propietario inscrito y si el terreno tiene cargas o gravámenes. Comprueba que quien te vende sea el propietario inscrito o tenga poder para hacerlo.',
        ],
      },
      {
        heading: 'Vigencia de la empresa o asociación vendedora',
        paragraphs: [
          'Acredita que la empresa o asociación que vende existe y está vigente. Pídelo siempre cuando el vendedor no sea una persona natural.',
        ],
      },
      {
        heading: 'Planeamiento integral',
        paragraphs: [
          'Es el plano aprobado que ordena las vías, manzanas, lotes y áreas de aporte del proyecto. Comprueba que el lote que vas a comprar aparece en ese plano, con su manzana y su número.',
        ],
      },
      {
        heading: 'Certificado de parámetros urbanísticos',
        paragraphs: [
          'Lo emite la municipalidad y te dice la zonificación del terreno y los parámetros para construir. Te permite saber qué puedes edificar antes de comprar.',
        ],
      },
      {
        heading: 'Certificado de inexistencia de restos arqueológicos (CIRA)',
        paragraphs: [
          'Confirma que en la superficie del terreno no hay restos arqueológicos. Es importante porque, si los hubiera, podría impedir o retrasar la construcción.',
        ],
      },
      {
        heading: 'Conformidad de la Autoridad Nacional del Agua (ANA)',
        paragraphs: [
          'Es la conformidad de la ANA sobre el predio. Pregunta también cómo se abastecerá de agua el proyecto y en qué plazos.',
        ],
      },
      {
        heading: 'Declaración jurada de autovalúo',
        paragraphs: [
          'Es la declaración del predio ante la municipalidad para el pago de tributos. Pregunta quién la presenta y cuándo pasa a tu nombre.',
        ],
      },
      {
        heading: 'Contrato y comprobantes de pago',
        paragraphs: [
          'El contrato debe indicar los datos del lote (manzana, número, área y colindancias), el precio, la forma de pago, los plazos y las condiciones de devolución. Guarda cada recibo y comprobante.',
        ],
      },
      {
        heading: 'Señales de alerta',
        paragraphs: ['Desconfía si te encuentras con alguna de estas situaciones:'],
        bullets: [
          'Te piden pagar antes de mostrarte los documentos.',
          'El vendedor no es el propietario inscrito y no presenta poder.',
          'El precio está muy por debajo del de la zona, sin explicación.',
          'Te presionan para decidir el mismo día.',
          'No te dejan visitar el terreno o no sabes dónde queda exactamente tu lote.',
        ],
      },
    ],
    links: [
      { label: 'Consulta los documentos de cada proyecto de Montepinar', path: '/informacion-legal' },
      { label: 'Agenda una visita guiada', path: '/visita-guiada' },
      { label: 'Conoce los proyectos de lotes', path: '/proyectos' },
    ],
  },
  {
    slug: 'terrenos-cerca-del-megapuerto-de-chancay',
    seoTitle: 'Terrenos cerca del megapuerto de Chancay | Montepinar',
    seoDescription:
      'Qué evaluar antes de comprar un terreno cerca del megapuerto de Chancay: accesos, documentos, zonificación y expectativas realistas de inversión.',
    title: 'Terrenos cerca del megapuerto de Chancay: qué saber antes de invertir',
    excerpt:
      'Por qué la zona atrae tanto interés, qué significa realmente "cerca" y qué revisar antes de comprar para no decidir solo por el puerto.',
    category: 'Zona e inversión',
    datePublished: '2026-11-13',
    dateModified: '2026-11-13',
    readingMinutes: 5,
    image: '/images/blog/cancha-y-modulos-vista-aerea-portada.webp',
    ogImage: '/images/blog/cancha-y-modulos-vista-aerea-portada.jpg',
    imageAlt: 'Vista aérea de una cancha de fútbol y los módulos de Montepinar en el terreno',
    intro: [
      'El megapuerto de Chancay puso a la zona norte de Lima en el radar de quienes buscan un terreno. Pero estar cerca del puerto no significa, por sí solo, que un terreno sea una buena compra.',
      'Esta guía te ayuda a mirar más allá del puerto y a comparar con criterio antes de decidir.',
    ],
    sections: [
      {
        heading: 'Por qué la zona atrae interés',
        paragraphs: [
          'Un puerto de esta escala suele impulsar el comercio, el empleo y la demanda de vivienda y servicios en su entorno. Por eso muchas personas miran Chancay y las ciudades cercanas, como Huaral y Huacho.',
          'Es una expectativa de crecimiento, no una garantía: lo que ocurra dependerá de cómo se desarrolle la zona en los próximos años.',
        ],
      },
      {
        heading: 'Qué significa realmente "cerca"',
        paragraphs: [
          'Cada vendedor usa la palabra a su manera. Pregunta cuánto se demora en llegar al puerto y a la ciudad más cercana, y por qué carretera. Si puedes, haz el recorrido tú mismo.',
        ],
      },
      {
        heading: 'Revisa primero lo legal',
        paragraphs: [
          'Un buen lugar no compensa un terreno con problemas. Antes de pagar, pide los documentos del predio y comprueba que todo esté en regla. Tienes la lista completa en nuestra guía de documentos para comprar un terreno.',
        ],
      },
      {
        heading: 'Mira el entorno, no solo el puerto',
        paragraphs: ['Para vivir o construir importan otras cosas además de la cercanía al puerto:'],
        bullets: [
          'Accesos y transporte público.',
          'Servicios: cuándo y cómo llegarán el agua, la luz y el desagüe.',
          'Zonificación: qué se puede construir en el terreno.',
          'Qué hay alrededor: comercios, colegios y centros de salud.',
        ],
      },
      {
        heading: 'Mantén expectativas realistas',
        paragraphs: [
          'Un terreno es una inversión a largo plazo. Nadie puede asegurarte cuánto subirá de valor ni cuándo. Desconfía de quien te promete ganancias seguras o rápidas.',
        ],
      },
      {
        heading: 'Compara y visita antes de decidir',
        paragraphs: [
          'Compara al menos dos o tres proyectos, mira sus documentos y visítalos. Ver el terreno en persona es la forma más clara de saber si es lo que buscas.',
        ],
      },
    ],
    links: [
      { label: 'Qué documentos pedir al comprar un terreno', path: '/blog/documentos-para-comprar-un-terreno' },
      { label: 'Conoce los proyectos de lotes', path: '/proyectos' },
      { label: 'Agenda una visita guiada', path: '/visita-guiada' },
    ],
  },
  {
    slug: 'lote-o-terreno-diferencia',
    seoTitle: 'Lote o terreno: diferencia y cuál te conviene | Montepinar',
    seoDescription:
      'Descubre la diferencia entre lote y terreno, qué documentos y servicios cambian en cada caso y cuál te conviene según lo que quieras construir.',
    title: 'Lote o terreno: ¿cuál es la diferencia y cuál te conviene?',
    excerpt:
      'Se usan como si fueran lo mismo, pero no lo son. Qué significa cada uno y cómo elegir según lo que quieras hacer.',
    category: 'Conceptos básicos',
    datePublished: '2026-11-13',
    dateModified: '2026-11-13',
    readingMinutes: 4,
    image: '/images/blog/entrada-arco-verde-montepinar-portada.webp',
    ogImage: '/images/blog/entrada-arco-verde-montepinar-portada.jpg',
    imageAlt: 'Ingreso de Montepinar con arco verde, caseta de control, banderas y la avenida de entrada',
    intro: [
      'En los avisos inmobiliarios se habla de "lotes" y de "terrenos" como si fueran lo mismo. Muchas veces se parecen, pero no son lo mismo, y la diferencia afecta a los documentos, los servicios y lo que puedes construir.',
    ],
    sections: [
      {
        heading: 'Qué es un terreno',
        paragraphs: [
          'Es el término general para una porción de suelo. Puede ser urbano, rural o eriazo, tener servicios o no, y estar subdividido o no. La palabra describe el suelo, pero no dice mucho de su situación legal ni de su desarrollo.',
        ],
      },
      {
        heading: 'Qué es un lote',
        paragraphs: [
          'Es una parcela con medidas y ubicación definidas dentro de una lotización o habilitación urbana. Forma parte de una manzana, tiene un número y aparece en un plano aprobado.',
        ],
      },
      {
        heading: 'Diferencias en la práctica',
        paragraphs: ['Aunque cada caso es distinto, estas son las diferencias que más se notan:'],
        bullets: [
          'Documentos: un lote suele contar con planeamiento y parámetros urbanísticos que indican qué se puede construir.',
          'Orden: el lote tiene manzana, número y colindancias claras, lo que facilita ubicarlo y comprarlo.',
          'Servicios y vías: en un lote de una habilitación urbana están previstos en el plano; en un terreno suelto hay que averiguarlo.',
          'Trámites: en un terreno suelto, la subdivisión y el saneamiento pueden requerir más gestiones.',
        ],
      },
      {
        heading: 'Cuál te conviene',
        paragraphs: [
          'Si quieres construir tu casa, un lote con documentos y parámetros claros te evita sorpresas. Si buscas un terreno para campo o para un uso especial, pregunta con cuidado por la zonificación y los permisos que necesitarás.',
        ],
      },
      {
        heading: 'Qué preguntar siempre',
        paragraphs: [],
        bullets: [
          '¿El terreno forma parte de una habilitación o lotización aprobada?',
          '¿Aparece en el plano, con su manzana y su número?',
          '¿Cuál es la zonificación y qué puedo construir?',
          '¿Qué documentos me entregan al comprar?',
        ],
      },
      {
        heading: 'En Montepinar',
        paragraphs: [
          'Los proyectos de Montepinar se venden por lotes, dentro de un planeamiento integral. Puedes consultar la documentación de cada proyecto en la sección de información legal.',
        ],
      },
    ],
    links: [
      { label: 'Qué documentos pedir al comprar un terreno', path: '/blog/documentos-para-comprar-un-terreno' },
      { label: 'Consulta la información legal de los proyectos', path: '/informacion-legal' },
      { label: 'Conoce los proyectos de lotes', path: '/proyectos' },
    ],
  },
  {
    slug: 'comprar-un-lote-en-cuotas',
    seoTitle: 'Comprar un lote en cuotas: cómo funciona | Montepinar',
    seoDescription:
      'Cómo funciona comprar un lote en cuotas sin banco: qué es la inicial, qué preguntar sobre intereses y atrasos, y qué debe decir tu contrato.',
    title: 'Comprar un lote en cuotas: cómo funciona el financiamiento directo',
    excerpt:
      'Qué es la inicial y la cuota mensual, qué preguntar antes de aceptar y qué debe quedar escrito en tu contrato.',
    category: 'Financiamiento',
    datePublished: '2026-11-13',
    dateModified: '2026-11-13',
    readingMinutes: 5,
    image: '/images/blog/visitantes-en-el-terreno-portada.webp',
    ogImage: '/images/blog/visitantes-en-el-terreno-portada.jpg',
    imageAlt: 'Grupo de visitantes atentos a una explicación al aire libre en el terreno del proyecto',
    intro: [
      'Muchas personas no pueden pagar un lote al contado, o no quieren pasar por un banco. El financiamiento directo, en el que pagas en cuotas a la propia inmobiliaria, es una de las formas más comunes de comprar un lote.',
      'Esta guía explica cómo funciona y qué conviene preguntar antes de aceptar.',
    ],
    sections: [
      {
        heading: 'Qué es el financiamiento directo',
        paragraphs: [
          'En lugar de pedir un crédito a un banco, acuerdas con la empresa que vende el lote un plan de pago en cuotas. Montepinar indica que no pide historial crediticio, y ofrece trato directo, sin exigir garantía de pago.',
        ],
      },
      {
        heading: 'Las piezas del pago',
        paragraphs: ['Casi todo plan de pago se compone de:'],
        bullets: [
          'La inicial: un primer pago al separar o firmar.',
          'La cuota mensual: el monto que pagas cada mes hasta completar el precio.',
          'El plazo: cuántos meses o años dura el pago.',
          'Los intereses, si los hay: pregunta siempre si existen y cómo se calculan.',
        ],
      },
      {
        heading: 'Cuánto puede costar cada mes',
        paragraphs: [
          'En Montepinar, las cuotas parten desde S/ 500 al mes. El monto final depende del lote y del plan que elijas, así que consulta los montos vigentes con un asesor. En la página de cada proyecto hay un simulador para estimar tu cuota.',
        ],
      },
      {
        heading: 'Qué preguntar antes de aceptar',
        paragraphs: [],
        bullets: [
          '¿Cuánto es la inicial y cuándo debo pagarla?',
          '¿Hay intereses? ¿Se mantienen iguales durante todo el plazo?',
          '¿Qué pasa si me atraso en una cuota?',
          '¿Puedo adelantar cuotas o pagar el saldo antes de tiempo?',
          '¿Qué pasa con lo que ya pagué si decido retirarme?',
          '¿Cuándo recibo el lote y qué documentos me entregan?',
        ],
      },
      {
        heading: 'Qué debe decir tu contrato',
        paragraphs: [
          'Todo lo que te prometan debe quedar por escrito: el precio total, la inicial, el monto y el número de cuotas, los intereses, las condiciones por atraso o retiro, y los datos del lote. Si algo no está en el contrato, no puedes exigirlo después.',
        ],
      },
      {
        heading: 'Guarda tus comprobantes',
        paragraphs: [
          'Conserva el comprobante de cada pago, ya sea un recibo o una transferencia. Son tu respaldo de lo que llevas pagado.',
        ],
      },
    ],
    links: [
      { label: 'Cómo comprar un lote en Huacho paso a paso', path: '/blog/como-comprar-un-lote-en-huacho' },
      { label: 'Conoce los proyectos y simula tu cuota', path: '/proyectos' },
      { label: 'Agenda una visita guiada', path: '/visita-guiada' },
    ],
  },
  {
    slug: 'como-es-una-visita-guiada',
    seoTitle: 'Visita guiada a un proyecto de lotes: cómo es | Montepinar',
    seoDescription:
      'Así es una visita guiada a Montepinar: viaje en bus desde Lima, recorrido del proyecto, charla y qué preguntar antes de separar tu lote.',
    title: 'Cómo es una visita guiada a un proyecto de lotes',
    excerpt:
      'Qué pasa desde que reservas hasta que vuelves a casa, y qué preguntas conviene llevar para aprovechar la visita.',
    category: 'Visitas',
    datePublished: '2026-11-13',
    dateModified: '2026-11-13',
    readingMinutes: 4,
    image: '/images/blog/guia-presentando-el-plano-portada.webp',
    ogImage: '/images/blog/guia-presentando-el-plano-portada.jpg',
    imageAlt: 'Guía con micrófono presentando el plano del proyecto junto a una asistente en el terreno',
    intro: [
      'Ver un lote en fotos o en un plano no es lo mismo que caminarlo. Por eso las visitas guiadas son una de las mejores formas de decidir con seguridad.',
      'Así funciona una visita guiada a Montepinar, paso a paso.',
    ],
    sections: [
      {
        heading: '1. Reservas tu fecha',
        paragraphs: [
          'Las visitas son los sábados y domingos. Reservas el día que prefieras y eliges dónde subir al bus: Av. Mendiola, frente a Tottus de Puente Piedra o el paradero Fundición de Puente Piedra. Los horarios exactos se confirman al reservar.',
        ],
      },
      {
        heading: '2. Viajas en bus, sin costo',
        paragraphs: [
          'El traslado de ida y vuelta no tiene costo. Un asesor te acompaña durante el viaje.',
        ],
      },
      {
        heading: '3. Recorres el proyecto',
        paragraphs: [
          'Al llegar caminan el terreno juntos para ver los lotes tal como son, no en un plano. Es el mejor momento para fijarte en la ubicación, los accesos y el entorno.',
        ],
      },
      {
        heading: '4. Desayuno y charla',
        paragraphs: [
          'Después del recorrido te invitan un desayuno y una charla donde te explican cómo es el proyecto y qué incluye cada lote. Tienes tiempo para hacer todas las preguntas que quieras.',
        ],
      },
      {
        heading: '5. Si te convence, te ayudan con el trámite',
        paragraphs: [
          'Si decides separar un lote, te acompañan con el pago de la separación y la firma del contrato, en el mismo lugar. Si no, vuelves a casa sin ningún compromiso.',
        ],
      },
      {
        heading: 'Cómo aprovechar la visita',
        paragraphs: ['Antes de ir, anota tus dudas. Estas son algunas preguntas útiles:'],
        bullets: [
          '¿Qué lotes están disponibles y cuáles son sus medidas?',
          '¿Qué documentos tiene el proyecto y puedo revisarlos?',
          '¿Cómo es el pago y qué montos hay que cubrir al inicio?',
          '¿Cuándo llegarán los servicios básicos?',
          '¿Cómo llego por mi cuenta al proyecto?',
        ],
      },
      {
        heading: 'Qué llevar',
        paragraphs: [
          'Ropa y calzado cómodos para caminar por terreno abierto, protector solar y agua. Lleva también tus preguntas anotadas.',
        ],
      },
    ],
    links: [
      { label: 'Reserva tu visita guiada', path: '/visita-guiada' },
      { label: 'Cómo comprar un lote en Huacho paso a paso', path: '/blog/como-comprar-un-lote-en-huacho' },
      { label: 'Conoce los proyectos de lotes', path: '/proyectos' },
    ],
  },
];

export const getBlogPost = (slug: string | null | undefined): BlogPost | undefined =>
  BLOG_POSTS.find((post) => post.slug === slug);

/** Fecha legible en español ('13 de noviembre de 2026'), sin depender de la zona horaria del servidor. */
export const formatBlogDate = (date: string): string =>
  new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${date}T00:00:00Z`),
  );
