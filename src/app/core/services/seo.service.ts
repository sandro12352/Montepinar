import { DOCUMENT, inject, Service } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { absoluteUrl, DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, SITE_DESCRIPTION, SITE_NAME } from '../config/site.config';

export interface SeoData {
  /** Título completo que se verá en la pestaña y en Google (ideal: hasta ~60 caracteres). */
  readonly title: string;
  /** Descripción para Google y al compartir (ideal: 120–160 caracteres). */
  readonly description?: string;
  /** Ruta de la página ('/about', '/projects/palmeras-de-montepinar'). Se usa para el canonical y og:url. */
  readonly path: string;
  /** Imagen para compartir; ruta relativa o URL absoluta. */
  readonly image?: string;
  readonly imageAlt?: string;
  /** Si es true, la página no se indexa (útil para páginas sin valor en buscadores). */
  readonly noindex?: boolean;
}

/**
 * Fija título, descripción, canonical, Open Graph y Twitter Card de cada página.
 * Corre también en el servidor (SSR/prerender), así que el HTML generado ya trae las etiquetas.
 * Actualiza las etiquetas por defecto de index.html en lugar de duplicarlas.
 */
@Service()
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  set(data: SeoData): void {
    const description = data.description ?? SITE_DESCRIPTION;
    const url = absoluteUrl(data.path);
    const image = absoluteUrl(data.image ?? DEFAULT_OG_IMAGE);
    // Sin imagen propia se usa la general, con su descripción; con imagen propia hay que pasar su imageAlt.
    const imageAlt = data.imageAlt ?? (data.image ? undefined : DEFAULT_OG_IMAGE_ALT);

    this.title.setTitle(data.title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({
      name: 'robots',
      content: data.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large',
    });
    this.setCanonical(url);

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:title', content: data.title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });
    // Todas las imágenes para compartir miden 1200×630 (public/images/og).
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: data.title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    if (imageAlt) {
      this.meta.updateTag({ property: 'og:image:alt', content: imageAlt });
      this.meta.updateTag({ name: 'twitter:image:alt', content: imageAlt });
    } else {
      this.meta.removeTag('property="og:image:alt"');
      this.meta.removeTag('name="twitter:image:alt"');
    }
  }

  /**
   * Inserta (o reemplaza) un bloque JSON-LD identificado por `id`.
   * Usar un id distinto por tipo de dato (p. ej. 'organization', 'project', 'faq').
   */
  setJsonLd(id: string, data: object): void {
    const head = this.document.head;
    const elementId = `jsonld-${id}`;
    let script = head.querySelector<HTMLScriptElement>(`script#${elementId}`);

    if (!script) {
      script = this.document.createElement('script');
      script.id = elementId;
      script.type = 'application/ld+json';
      head.appendChild(script);
    }
    // Se escapa "<" para que ningún texto pueda cerrar el <script> antes de tiempo.
    script.textContent = JSON.stringify(data).replace(/</g, '\u003c');
  }

  removeJsonLd(id: string): void {
    this.document.head.querySelector(`script#jsonld-${id}`)?.remove();
  }

  private setCanonical(url: string): void {
    const head = this.document.head;
    let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}

/** Datos de SEO que una ruta declara en `data: { seo: {...} }`. El path lo toma el router de la URL. */
export type RouteSeo = Omit<SeoData, 'path'>;
