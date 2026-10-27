import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon, RouterLink],
  providers: [provideIcons({ lucideArrowRight })],
  selector: 'app-about-stats',
  templateUrl: './about-stats.component.html',
})
export class AboutStatsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly stats = [
    { value: 10, prefix: '+', suffix: '', label: 'Años de trayectoria', text: 'Desarrollando comunidades campestres con visión de largo plazo.' },
    { value: 6000, prefix: '+', suffix: '', label: 'Familias felices', text: 'Hogares que ya construyen su sueño en Montepinar.' },
    { value: 15, prefix: '', suffix: '', label: 'Proyectos entregados', text: 'Entornos verdes listos para vivir y compartir.' },
    { value: 98, prefix: '', suffix: '%', label: 'Clientes satisfechos', text: 'Familias que recomiendan su experiencia con nosotros.' },
  ];

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        gsap.fromTo(
          '[data-head]',
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '[data-heading]', start: 'top 82%', once: true } },
        );

        const statsTrigger = { trigger: '[data-stats]', start: 'top 82%', once: true };
        gsap.fromTo('[data-stat]', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', scrollTrigger: statsTrigger });
        gsap.fromTo('[data-rule]', { scaleX: 0 }, { scaleX: 1, duration: 1.1, stagger: 0.12, ease: 'power3.out', scrollTrigger: statsTrigger });

        root.querySelectorAll<HTMLElement>('[data-count]').forEach((counter) => {
          const value = { current: 0 };
          gsap.to(value, {
            current: Number(counter.dataset['count']),
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              counter.textContent = Math.round(value.current).toLocaleString('es-PE');
            },
            scrollTrigger: statsTrigger,
          });
        });

        gsap.to('[data-orb]', { yPercent: -35, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } });
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
