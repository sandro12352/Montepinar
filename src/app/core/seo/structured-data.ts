import {
  absoluteUrl,
  PRIMARY_PHONE,
  SECONDARY_PHONE,
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_LANG,
  SITE_LOGO,
  SITE_NAME,
  SITE_OFFICE,
  SITE_SOCIAL_URLS,
  SITE_URL,
} from '../config/site.config';

/** Constructores de datos estructurados (schema.org / JSON-LD) que lee Google. */

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/**
 * Ficha de la empresa. Se publica en todas las páginas.
 * Los horarios replican OFFICE_HOURS (contact.data.ts) en el formato que pide schema.org.
 */
export const organizationJsonLd = (): object => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'RealEstateAgent',
      '@id': ORGANIZATION_ID,
      name: SITE_NAME,
      url: SITE_URL,
      logo: absoluteUrl(SITE_LOGO),
      image: absoluteUrl(SITE_LOGO),
      description: SITE_DESCRIPTION,
      telephone: PRIMARY_PHONE,
      email: SITE_EMAIL,
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE_OFFICE.streetAddress,
        addressLocality: SITE_OFFICE.locality,
        addressRegion: SITE_OFFICE.region,
        addressCountry: SITE_OFFICE.country,
      },
      areaServed: ['Huacho', 'Iquitos'].map((name) => ({ '@type': 'City', name })),
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '13:00' },
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: PRIMARY_PHONE,
          contactType: 'customer service',
          areaServed: 'PE',
          availableLanguage: 'es',
        },
        {
          '@type': 'ContactPoint',
          telephone: SECONDARY_PHONE,
          contactType: 'sales',
          areaServed: 'PE',
          availableLanguage: 'es',
        },
      ],
      sameAs: SITE_SOCIAL_URLS,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: SITE_LANG,
      publisher: { '@id': ORGANIZATION_ID },
    },
  ],
});

export interface BreadcrumbItem {
  readonly name: string;
  readonly path: string;
}

/** Migas de pan: Inicio › Proyectos › Nombre del proyecto. */
export const breadcrumbJsonLd = (items: readonly BreadcrumbItem[]): object => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export interface ProjectJsonLdInput {
  readonly name: string;
  readonly description: string;
  readonly path: string;
  readonly image: string;
  /** Precio de lista como se muestra en el sitio, p. ej. 'S/ 25,000'. */
  readonly priceFrom: string;
}

/** Ficha de un proyecto de lotes, con su precio "desde". */
export const projectJsonLd = (input: ProjectJsonLdInput): object => {
  const lowPrice = Number(input.priceFrom.replace(/[^\d]/g, ''));
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    image: absoluteUrl(input.image),
    brand: { '@id': ORGANIZATION_ID },
    category: 'Lotes de terreno',
    ...(lowPrice > 0 && {
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'PEN',
        lowPrice,
        url: absoluteUrl(input.path),
        seller: { '@id': ORGANIZATION_ID },
      },
    }),
  };
};

export interface FaqJsonLdItem {
  readonly question: string;
  readonly answer: string;
  readonly inSchema?: boolean;
}

/**
 * Ficha de preguntas frecuentes. Solo se publica cuando el FAQ visible lee de la misma fuente
 * (features/home/data/faq.data.ts): Google exige que coincida con lo que se ve en la página.
 */
export const faqJsonLd = (items: readonly FaqJsonLdItem[]): object => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items
    .filter((item) => item.inSchema !== false)
    .map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
});
