import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon],
  providers: [provideIcons({ lucideArrowRight })],
  selector: 'app-about-stats',
  templateUrl: './about-stats.component.html',
})
export class AboutStatsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly stats = [
    { value: 10, prefix: '+', suffix: '', label: 'Años de trayectoria', text: 'Desarrollando comunidades campestres con visión de largo plazo.' },
    { value: 1200, prefix: '+', suffix: '', label: 'Familias felices', text: 'Hogares que ya construyen su sueño en Montepinar.' },
    { value: 15, prefix: '', suffix: '', label: 'Proyectos entregados', text: 'Entornos verdes listos para vivir y compartir.' },
    { value: 98, prefix: '', suffix: '%', label: 'Clientes satisfechos', text: 'Familias que recomiendan su experiencia con nosotros.' },
  ];

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const heading = root.querySelector<HTMLElement>('[data-heading]');
        const tiles = Array.from(root.querySelectorAll<HTMLElement>('[data-stat]'));
        const trigger = { trigger: tiles[0] ?? root, start: 'top 85%', once: true };

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

        if (tiles.length) {
          gsap.fromTo(tiles,
            { autoAlpha: 0, y: 24, scale: 0.975 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 1,
              stagger: 0.1,
              ease: 'power2.out',
              clearProps: 'transform',
              scrollTrigger: trigger,
            },
          );
        }

        root.querySelectorAll<HTMLElement>('[data-count]').forEach((counter) => {
          const target = Number(counter.dataset['count']);
          const value = { current: 0 };
          gsap.to(value, {
            current: target,
            duration: 1.8,
            ease: 'power2.out',
            snap: { current: 1 },
            onUpdate: () => {
              counter.textContent = Math.round(value.current).toLocaleString('es-PE');
            },
            scrollTrigger: trigger,
          });
        });
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
