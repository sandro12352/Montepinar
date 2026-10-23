import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideArrowRight } from '@ng-icons/lucide';
import { HlmCarouselImports } from '@spartan-ng/helm/carousel';
import AutoScroll from 'embla-carousel-auto-scroll';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TestimonialVideo {
  readonly title: string;
  readonly poster: string;
  readonly videoSrc: string | null;
  readonly comments: readonly TestimonialComment[];
}

interface TestimonialComment {
  readonly text: string;
  readonly author: string;
  readonly role: string;
  readonly initials: string;
}

@Component({
  imports: [HlmCarouselImports, NgIcon],
  providers: [provideIcons({ lucideArrowLeft, lucideArrowRight })],
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
})
export class TestimonialsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly videos: readonly TestimonialVideo[] = [
    {
      title: 'Una nueva forma de vivir', poster: '/images/entrada.png', videoSrc: '/video/MONTEPINAR.mp4',
      comments: [
        { text: 'Nos encantó conocer el proyecto y sus áreas comunes.', author: 'María y Luis', role: 'Familia visitante · Ejemplo ficticio', initials: 'ML' },
        { text: 'La visita nos ayudó a imaginar nuestra vida aquí.', author: 'Familia Ramírez', role: 'Visitantes · Ejemplo ficticio', initials: 'FR' },
        { text: 'El recorrido nos permitió conocer cada espacio con calma.', author: 'Patricia R.', role: 'Visitante · Ejemplo ficticio', initials: 'PR' },
        { text: 'Nos sentimos bien atendidos desde el primer momento.', author: 'Familia Soto', role: 'Visitantes · Ejemplo ficticio', initials: 'FS' },
      ],
    },
    {
      title: 'Espacios para compartir', poster: '/images/AsociacionMontepinar.webp', videoSrc: '/video/MONTEPINAR.mp4',
      comments: [
        { text: 'Encontramos espacios para disfrutar en familia.', author: 'Carlos G.', role: 'Visitante · Ejemplo ficticio', initials: 'CG' },
        { text: 'Nos gustó la tranquilidad del entorno y la distribución de los espacios.', author: 'Ana y Javier', role: 'Familia visitante · Ejemplo ficticio', initials: 'AJ' },
        { text: 'Las áreas comunes hacen que el proyecto se sienta acogedor.', author: 'Marta L.', role: 'Visitante · Ejemplo ficticio', initials: 'ML' },
        { text: 'Pudimos conocer opciones que encajan con lo que buscamos.', author: 'Familia Vega', role: 'Visitantes · Ejemplo ficticio', initials: 'FV' },
      ],
    },
    {
      title: 'Un lugar para crecer', poster: '/images/slide2.webp', videoSrc: '/video/MONTEPINAR.mp4',
      comments: [
        { text: 'Pudimos resolver nuestras dudas y conocer mejor cada proyecto.', author: 'Lucía M.', role: 'Visitante · Ejemplo ficticio', initials: 'LM' },
        { text: 'Las áreas comunes fueron una grata sorpresa durante el recorrido.', author: 'Familia Torres', role: 'Visitantes · Ejemplo ficticio', initials: 'FT' },
        { text: 'El entorno nos pareció ideal para compartir en familia.', author: 'Diego P.', role: 'Visitante · Ejemplo ficticio', initials: 'DP' },
        { text: 'Nos llevamos una idea clara de cómo sería vivir aquí.', author: 'Familia León', role: 'Visitantes · Ejemplo ficticio', initials: 'FL' },
      ],
    },
  ];

  // Se duplica la lista para que el carrusel a todo el ancho tenga slides suficientes para el loop.
  protected readonly loopVideos: readonly TestimonialVideo[] = [...this.videos, ...this.videos];

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
