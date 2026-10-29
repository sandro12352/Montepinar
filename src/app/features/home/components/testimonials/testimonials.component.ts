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
  /** Foto del cliente, que ocupa el lugar del video cuando no hay. */
  readonly photo: string;
}

@Component({
  imports: [HlmCarouselImports],
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
})
export class TestimonialsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  // Testimonios de ejemplo: reemplaza textos, fotos y videos por los reales de cada cliente.
  protected readonly testimonials: readonly Testimonial[] = [
    {
      title: 'Una nueva forma de vivir', text: 'Nos encantó conocer el proyecto y sus áreas comunes.',
      author: 'María y Luis', role: 'Familia visitante · Ejemplo ficticio', initials: 'ML',
      videoSrc: '/video/MONTEPINAR.mp4', poster: '/images/entrada.png', photo: '/images/avatars/women-44.jpg',
    },
    {
      title: 'Espacios para compartir', text: 'Nos gustó la tranquilidad del entorno y la distribución de los espacios.',
      author: 'Ana y Javier', role: 'Familia visitante · Ejemplo ficticio', initials: 'AJ',
      videoSrc: null, poster: '/images/AsociacionMontepinar.webp', photo: '/images/avatars/men-32.jpg',
    },
    {
      title: 'Un lugar para crecer', text: 'Pudimos resolver nuestras dudas y conocer mejor cada proyecto.',
      author: 'Lucía M.', role: 'Visitante · Ejemplo ficticio', initials: 'LM',
      videoSrc: '/video/MONTEPINAR.mp4', poster: '/images/slide2.webp', photo: '/images/avatars/women-68.jpg',
    },
    {
      title: 'Atención desde el primer día', text: 'Nos sentimos bien atendidos desde el primer momento.',
      author: 'Familia Soto', role: 'Visitantes · Ejemplo ficticio', initials: 'FS',
      videoSrc: null, poster: '/images/slide3.webp', photo: '/images/avatars/men-75.jpg',
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
