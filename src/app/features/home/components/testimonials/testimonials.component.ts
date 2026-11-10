import { NgOptimizedImage } from '@angular/common';
import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { HlmCarouselImports } from '@spartan-ng/helm/carousel';
import AutoScroll from 'embla-carousel-auto-scroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  readonly title: string;
  readonly text: string;
  readonly author: string;
  readonly role: string;
  readonly initials: string;
  /** Video del testimonio. Si es null, se muestra la foto del cliente. */
  readonly videoSrc: string | null;
  /** Imagen de portada del video. */
  readonly poster: string;
  /** Foto del cliente (4:5), que ocupa el lugar del video cuando no hay. */
  readonly photo: string;
}

@Component({
  imports: [NgOptimizedImage, HlmCarouselImports],
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
})
export class TestimonialsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  // Fotos reales de clientes que ya compraron su lote (public/images/testimonios, 800x1000, 4:5).
  // TODO: reemplazar `author` por nombre y apellido reales (y `initials`) y los textos por sus palabras.
  // Para volver a mostrar video, pon la ruta en `videoSrc`.
  protected readonly testimonials: readonly Testimonial[] = [
    {
      title: 'Ya abrió la puerta de su lote', text: 'Compró su terreno en Montepinar y hoy visita su caseta, listo para empezar a construir su futuro.',
      author: 'Propietario', role: 'Compró su lote en Montepinar', initials: 'MP',
      videoSrc: null, poster: '/images/testimonios/joven-mzj-lt33.webp', photo: '/images/testimonios/joven-mzj-lt33.webp',
    },
    {
      title: 'Ver su lote lo hizo todo más real', text: 'Después de recorrer el terreno decidió comprarlo y hoy posa feliz frente a su caseta.',
      author: 'Propietaria', role: 'Compró su lote en Montepinar', initials: 'MP',
      videoSrc: null, poster: '/images/testimonios/mujer-mzq-lt27.webp', photo: '/images/testimonios/mujer-mzq-lt27.webp',
    },
    {
      title: 'El primer paso de una familia', text: 'Madre e hijo dan la bienvenida a su nuevo espacio: ya son propietarios de su lote en Montepinar.',
      author: 'Madre e hijo', role: 'Compraron su lote en Montepinar', initials: 'MP',
      videoSrc: null, poster: '/images/testimonios/madre-hijo-mzd-lt01.webp', photo: '/images/testimonios/madre-hijo-mzd-lt01.webp',
    },
    {
      title: 'Un sueño que se cumple en pareja', text: 'Una pareja celebra la compra de su lote con la ilusión de empezar esta etapa juntos.',
      author: 'Pareja propietaria', role: 'Compraron su lote en Montepinar', initials: 'MP',
      videoSrc: null, poster: '/images/testimonios/pareja-mza-lt09.webp', photo: '/images/testimonios/pareja-mza-lt09.webp',
    },
    {
      title: 'Una decisión que tomaron juntas', text: 'Dos amigas conocieron el proyecto, eligieron su terreno y hoy lo recorren como propietarias.',
      author: 'Propietarias', role: 'Compraron su lote en Montepinar', initials: 'MP',
      videoSrc: null, poster: '/images/testimonios/amigas-mzl-lt26.webp', photo: '/images/testimonios/amigas-mzl-lt26.webp',
    },
    {
      title: 'Una compra con toda la confianza', text: 'Tras la visita guiada, compraron su lote y hoy disfrutan de ver su terreno en persona.',
      author: 'Propietarias', role: 'Compraron su lote en Montepinar', initials: 'MP',
      videoSrc: null, poster: '/images/testimonios/visitantes-mza1-lt25.webp', photo: '/images/testimonios/visitantes-mza1-lt25.webp',
    },
    {
      title: 'Toda la familia en su terreno', text: 'Tres generaciones celebran juntas la compra de su lote y el comienzo de su proyecto en Montepinar.',
      author: 'Familia propietaria', role: 'Compraron su lote en Montepinar', initials: 'MP',
      videoSrc: null, poster: '/images/testimonios/familia-mzk-lt14.webp', photo: '/images/testimonios/familia-mzk-lt14.webp',
    },
  ];

  protected readonly carouselPlugins = [
    AutoScroll({
      speed: 2,
      startDelay: 0,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  ];

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const heading = root.querySelector<HTMLElement>('[data-testimonials-content]');
        const items = Array.from(root.querySelectorAll<HTMLElement>('[data-testimonial-item]'));
        const controls = root.querySelector<HTMLElement>('[data-testimonials-controls]');

        if (heading) {
          gsap.fromTo(heading.children,
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: { trigger: heading, start: 'top 82%', once: true },
            },
          );
        }

        // Los testimonios aparecen uno por uno, igual que la galería.
        if (items.length) {
          gsap.fromTo(items,
            { autoAlpha: 0, y: 24, scale: 0.975 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.2,
              ease: 'power2.out',
              scrollTrigger: { trigger: items[0], start: 'top 84%', once: true },
            },
          );
        }

        if (controls) {
          gsap.fromTo(controls,
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: { trigger: controls, start: 'top 95%', once: true },
            },
          );
        }
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }

}
