import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCompass,
  lucideEye,
  lucideFileCheck,
  lucideHandshake,
  lucideHouse,
  lucideSprout,
  lucideTrees,
  lucideUsers,
} from '@ng-icons/lucide';
import { HlmCarousel, HlmCarouselImports } from '@spartan-ng/helm/carousel';
import type { EmblaCarouselType } from 'embla-carousel';
import type { EmblaCarouselDirective } from 'embla-carousel-angular';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PurposeFeature {
  readonly icon: string;
  readonly title: string;
  readonly text: string;
}

interface PurposeSlide {
  readonly image: string;
  readonly imageAlt: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly text: string;
  readonly features: readonly PurposeFeature[];
}

@Component({
  imports: [HlmCarouselImports, NgIcon],
  providers: [
    provideIcons({
      lucideCompass,
      lucideEye,
      lucideFileCheck,
      lucideHandshake,
      lucideHouse,
      lucideSprout,
      lucideTrees,
      lucideUsers,
    }),
  ],
  selector: 'app-about-purpose',
  templateUrl: './about-purpose.component.html',
})
export class AboutPurposeComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly carousel = viewChild(HlmCarousel);

  protected readonly slides: readonly PurposeSlide[] = [
    {
      image: '/images/slide3.webp',
      imageAlt: 'Visitantes recorren el proyecto Montepinar',
      eyebrow: 'Nuestra misión',
      title: 'Hacer que acceder a tu terreno sea simple, claro y confiable.',
      text: 'Acompañamos a cada familia con información transparente y planes a su medida, para que dar el paso hacia su lote sea una decisión tranquila y bien informada.',
      features: [
        { icon: 'lucideHandshake', title: 'Financiamiento directo', text: 'Planes a tu medida, sin bancos' },
        { icon: 'lucideFileCheck', title: 'Acompañamiento legal', text: 'Te guiamos en cada documento' },
        { icon: 'lucideEye', title: 'Transparencia total', text: 'Condiciones claras desde el inicio' },
        { icon: 'lucideTrees', title: 'Entornos verdes', text: 'Espacios para respirar y compartir' },
      ],
    },
    {
      image: '/images/MontepinarIquitos.webp',
      imageAlt: 'Atardecer sobre el proyecto Montepinar Iquitos',
      eyebrow: 'Nuestra visión',
      title: 'Construir comunidades en equilibrio con la naturaleza.',
      text: 'Soñamos con lugares donde cada generación pueda florecer, con vecinos que se conocen, un entorno que se cuida y hogares pensados para quedarse.',
      features: [
        { icon: 'lucideUsers', title: 'Comunidades activas', text: 'Vida en comunidad cada día' },
        { icon: 'lucideSprout', title: 'Naturaleza protegida', text: 'Desarrollos que respetan el paisaje' },
        { icon: 'lucideCompass', title: 'Decisiones informadas', text: 'Eliges con confianza y a tu ritmo' },
        { icon: 'lucideHouse', title: 'Hogares para generaciones', text: 'Lugares para quedarse y crecer' },
      ],
    },
  ];

  /** Embla vive dentro de hlm-carousel (miembro protegido), así que se obtiene de su directiva. */
  private emblaApi(): EmblaCarouselType | null {
    const carousel = this.carousel() as unknown as { _emblaCarousel(): EmblaCarouselDirective } | undefined;
    return carousel?._emblaCarousel().emblaApi ?? null;
  }

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const mm = gsap.matchMedia();

      // Entrada: el texto y las cards aparecen escalonados al llegar a la sección.
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        gsap.fromTo('[data-reveal]',
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: root, start: 'top 75%', once: true },
          },
        );

        gsap.fromTo('[data-card]',
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.15,
            delay: 0.2,
            ease: 'power2.out',
            clearProps: 'transform',
            scrollTrigger: { trigger: root, start: 'top 75%', once: true },
          },
        );
      }, root);

      // Escritorio (como la referencia): la sección se fija y el scroll vertical desplaza todo el carril del
      // carrusel (frase + cards) hacia la izquierda de forma continua. El movimiento se aplica sobre el motor
      // de Embla del carrusel de Spartan, así que su estado interno queda siempre sincronizado.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        let frame = 0;
        let timeline: gsap.core.Timeline | undefined;

        // Embla se inicializa dentro de hlm-carousel un instante después del primer render: se espera a que exista.
        const setup = (attempt: number) => {
          const api = this.emblaApi();
          if (!api) {
            if (attempt < 120) frame = requestAnimationFrame(() => setup(attempt + 1));
            return;
          }

          const engine = api.internalEngine();
          const distance = () => Math.max(0, api.containerNode().scrollWidth - api.rootNode().clientWidth);
          const state = { x: 0 };
          const apply = (x: number) => {
            engine.location.set(x);
            engine.target.set(x);
            engine.translate.to(x);
          };

          const stage = root.querySelector<HTMLElement>('[data-stage]');
          // Al inicio las cards quedan cerca del borde superior; al avanzar bajan hasta el centro.
          const startY = () => {
            if (!stage) return 0;
            const free = root.clientHeight - stage.offsetHeight;
            return Math.min(0, 96 - free / 2);
          };

          timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: root,
              start: 'top top',
              end: () => `+=${distance() + window.innerHeight * 0.35}`,
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
              onRefresh: () => apply(state.x),
            },
          });

          if (stage) {
            timeline.fromTo(stage, { y: startY }, { y: 0, duration: 0.3, ease: 'power2.out' }, 0);
          }
          timeline.to(state, { x: () => -distance(), duration: 1, onUpdate: () => apply(state.x) }, 0);
        };
        setup(0);

        return () => {
          cancelAnimationFrame(frame);
          timeline?.scrollTrigger?.kill();
          timeline?.kill();
        };
      });

      this.destroyRef.onDestroy(() => {
        mm.revert();
        context.revert();
      });
    });
  }
}
