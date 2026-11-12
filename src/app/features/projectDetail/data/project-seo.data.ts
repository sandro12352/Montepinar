/**
 * Datos de SEO de cada proyecto (título y descripción para Google y redes).
 * Van aparte de projects.data.ts a propósito: aquí la ciudad es la que se quiere posicionar,
 * sin tocar el texto visible de la página. Palmeras de Montepinar y la Asociación de Vivienda se posicionan
 * ambos como Huacho. Las claves de este objeto son los slugs de projects.data.ts: si un slug cambia,
 * actualizar aquí, public/sitemap.xml y poner una redirección 301 del slug viejo (si el sitio ya está publicado).
 * El precio se recibe como parámetro para que siempre coincida con el de projects.data.ts.
 */
export interface ProjectSeo {
  readonly title: string;
  /** Imagen para compartir (1200×630) con el nombre del proyecto. */
  readonly image: string;
  /** Descripción de la imagen para compartir (og:image:alt). */
  readonly imageAlt: string;
  readonly description: (priceFrom: string) => string;
}

export const PROJECT_SEO: Readonly<Record<string, ProjectSeo>> = {
  'palmeras-de-montepinar': {
    title: 'Lotes en venta en Huacho | Palmeras de Montepinar',
    image: '/images/og/og-palmeras.jpg',
    imageAlt: 'Entrada de Palmeras de Montepinar en Huacho, con banderas y jardines, y el texto Lotes en venta en Huacho',
    description: (price) =>
      `Lotes de 120 a 1,000 m² en Huacho desde ${price}, cerca del megapuerto de Chancay. Country club, seguridad 24/7 y áreas verdes en Palmeras de Montepinar.`,
  },
  'asociacion-de-vivienda-montepinar': {
    title: 'Lotes en venta en Huacho | Asociación de Vivienda Montepinar',
    image: '/images/og/og-asociacion.jpg',
    imageAlt: 'Vista aérea del ingreso de la Asociación de Vivienda Montepinar en Huacho, con el mar al fondo, y el texto Lotes en venta en Huacho',
    description: (price) =>
      `Lotes de 120 a 200 m² en Huacho desde ${price}, junto a Mall Montepinar y cerca del megapuerto de Chancay. Más de 5,000 áreas verdes.`,
  },
  'amazon-lodge-montepinar': {
    title: 'Lotes en venta en Iquitos | Amazon Lodge Montepinar',
    image: '/images/og/og-iquitos.jpg',
    imageAlt: 'Cartel de Montepinar Iquitos entre jardines, con el río al fondo, y el texto Lotes en venta en Iquitos',
    description: (price) =>
      `Lotes de 450 m² en Iquitos desde ${price} con laguna privada, eco-energía y bosque protegido. Conoce Amazon Lodge Montepinar y agenda tu visita.`,
  },
};
