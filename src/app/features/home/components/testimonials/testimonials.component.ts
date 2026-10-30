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

  // Testimonios de ejemplo: reemplaza textos y fotos por los reales de cada cliente.
  // `photo` debe ser un PNG recortado (sin fondo). Por ahora usan recortes de /images/equipo como marcador.
  // Para volver a mostrar video, pon la ruta en `videoSrc`.
  protected readonly testimonials: readonly Testimonial[] = [
    {
      title: 'Una nueva forma de vivir', text: 'Nos encantó conocer el proyecto y sus áreas comunes.',
      author: 'María y Luis', role: 'Familia visitante · Ejemplo ficticio', initials: 'ML',
      videoSrc: null, poster: '/images/entrada.png', photo: '/images/equipo/chavela-saucedo-3.png',
    },
    {
      title: 'Espacios para compartir', text: 'Nos gustó la tranquilidad del entorno y la distribución de los espacios.',
      author: 'Ana y Javier', role: 'Familia visitante · Ejemplo ficticio', initials: 'AJ',
      videoSrc: null, poster: '/images/AsociacionMontepinar.webp', photo: '/images/equipo/jose-maria-varillas-4.png',
    },
    {
      title: 'Un lugar para crecer', text: 'Pudimos resolver nuestras dudas y conocer mejor cada proyecto.',
      author: 'Lucía M.', role: 'Visitante · Ejemplo ficticio', initials: 'LM',
      videoSrc: null, poster: '/images/slide2.webp', photo: '/images/equipo/hillma-machuca-2.png',
    },
    {
      title: 'Atención desde el primer día', text: 'Nos sentimos bien atendidos desde el primer momento.',
      author: 'Familia Soto', role: 'Visitantes · Ejemplo ficticio', initials: 'FS',
      videoSrc: null, poster: '/images/slide3.webp', photo: '/images/equipo/miguel-salgado-3.png',
    },
    {
      title: 'El viaje valió la pena', text: 'El bus, el desayuno y el recorrido fueron muy ordenados. Se nota que cuidan cada detalle.',
      author: 'Rosa y Pedro', role: 'Familia visitante · Ejemplo ficticio', initials: 'RP',
      videoSrc: null, poster: '/images/slide3.webp', photo: '/images/equipo/chavela-saucedo-5.png',
    },
    {
      title: 'Todo claro y en regla', text: 'Me mostraron los documentos del proyecto y me explicaron cada paso del trámite sin presiones.',
      author: 'Carlos R.', role: 'Comprador · Ejemplo ficticio', initials: 'CR',
      videoSrc: null, poster: '/images/entrada.png', photo: '/images/equipo/jose-maria-varillas-3.png',
    },
    {
      title: 'Ver el terreno lo cambió todo', text: 'En plano uno imagina, pero caminar los lotes me dio la seguridad que necesitaba para decidir.',
      author: 'Elena V.', role: 'Visitante · Ejemplo ficticio', initials: 'EV',
      videoSrc: null, poster: '/images/slide2.webp', photo: '/images/equipo/hillma-machuca-3.png',
    },
    {
      title: 'Un futuro para mis hijos', text: 'Buscaba un lugar para que mis hijos crezcan con espacio y tranquilidad, y lo encontramos aquí.',
      author: 'Jorge y Karla', role: 'Familia compradora · Ejemplo ficticio', initials: 'JK',
      videoSrc: null, poster: '/images/AsociacionMontepinar.webp', photo: '/images/equipo/miguel-salgado-2.png',
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
