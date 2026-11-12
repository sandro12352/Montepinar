import {
  CONTACT_EMAIL,
  CONTACT_PHONES,
  OFFICE_ADDRESS,
  OFFICE_HOURS,
  SOCIAL_LINKS,
  WHATSAPP_NUMBER,
} from '../../features/contact/data/contact.data';

/**
 * Datos globales del sitio para SEO (canonical, Open Graph, JSON-LD).
 * El dominio vive solo aquí: si cambia, se cambia en esta línea.
 * Teléfonos, dirección, horarios y redes se reutilizan de contact.data.ts.
 */
export const SITE_URL = 'https://www.montepinarinmobiliaria.pe';

export const SITE_NAME = 'Montepinar Inmobiliaria & Constructora';
export const SITE_SHORT_NAME = 'Montepinar';
export const SITE_LOCALE = 'es_PE';
export const SITE_LANG = 'es-PE';

export const SITE_DESCRIPTION =
  'Lotes y terrenos en Huacho e Iquitos con áreas verdes, seguridad y facilidades de pago. Agenda tu visita con Montepinar Inmobiliaria & Constructora.';

/** Rutas relativas al dominio; se vuelven absolutas con absoluteUrl(). */
export const SITE_LOGO = '/images/logo.webp';
export const DEFAULT_OG_IMAGE = '/images/og/og-default.jpg';
export const DEFAULT_OG_IMAGE_ALT = 'Tres proyectos de Montepinar: el acceso de Palmeras y el ingreso de la Asociación, en Huacho, y el cartel de Iquitos, con el texto Lotes en Huacho e Iquitos';

export const SITE_OFFICE = {
  streetAddress: 'Jr. César Vallejo 958, Urb. Covida',
  locality: 'Los Olivos',
  region: 'Lima',
  country: 'PE',
  /** Dirección completa tal como se muestra en el sitio. */
  full: OFFICE_ADDRESS,
} as const;

/** Teléfono principal (WhatsApp) en formato internacional, el que pide Google. */
export const PRIMARY_PHONE = `+${WHATSAPP_NUMBER}`;

/** Teléfono de oficina como contacto secundario. */
export const SECONDARY_PHONE = CONTACT_PHONES.find((phone) => phone.label === 'Oficina')?.tel ?? PRIMARY_PHONE;

export const SITE_EMAIL = CONTACT_EMAIL;
export const SITE_HOURS = OFFICE_HOURS;

/** Solo perfiles oficiales (se usan en sameAs del JSON-LD). */
export const SITE_SOCIAL_URLS: readonly string[] = SOCIAL_LINKS.map((link) => link.href);

/** Convierte una ruta relativa ('/images/x.webp', '/about') en URL absoluta del sitio. */
export const absoluteUrl = (path = '/'): string =>
  /^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
