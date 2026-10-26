import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDroplets, lucideShieldCheck, lucideSprout, lucideUsers, lucideZap } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Benefit {
  readonly icon: string;
  readonly title: string;
  readonly text: string;
}

@Component({
  imports: [NgIcon],
  providers: [provideIcons({ lucideDroplets, lucideShieldCheck, lucideSprout, lucideUsers, lucideZap })],
  selector: 'app-projects-benefits',
  templateUrl: './projects-benefits.component.html',
})
export class ProjectsBenefitsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly benefits: readonly Benefit[] = [
    {
      icon: 'lucideShieldCheck',
      title: 'Seguridad todo el día',
      text: 'Ingreso controlado y vigilancia 24/7 para que tu familia viva tranquila.',
    },
    {
      icon: 'lucideSprout',
      title: 'Áreas verdes de verdad',
      text: 'Hasta un 40% del proyecto es naturaleza: parques, senderos y espacios para respirar.',
    },
    {
      icon: 'lucideUsers',
      title: 'Una comunidad para compartir',
      text: 'Club, zonas deportivas y espacios pensados para encontrarte con tus vecinos.',
    },
    {
      icon: 'lucideDroplets',
      title: 'Servicios listos para construir',
      text: 'Agua, riego tecnificado y electricidad para que empieces a edificar sin esperas.',
    },
    {
      icon: 'lucideZap',
      title: 'Acompañamiento legal',
      text: 'Un asesor te guía con la documentación en cada etapa, de la separación a la entrega.',
    },
  ];

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        gsap.fromTo('[data-reveal]',
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: root.querySelector('[data-text]'), start: 'top 78%', once: true },
          },
        );

        // Cada fila dibuja su línea y revela el contenido al entrar en pantalla.
        root.querySelectorAll<HTMLElement>('[data-benefit]').forEach((row) => {
          const timeline = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 88%', once: true } });

          timeline
            .fromTo(row.querySelector('[data-line]'),
              { scaleX: 0 },
              { scaleX: 1, duration: 1, ease: 'power3.inOut', transformOrigin: 'left center' },
            )
            .fromTo(row.querySelectorAll('[data-benefit-item]'),
              { autoAlpha: 0, y: 22 },
              { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.08, ease: 'power2.out' },
              0.2,
            );
        });
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
