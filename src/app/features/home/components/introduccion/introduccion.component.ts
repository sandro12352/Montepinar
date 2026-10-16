import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon],
  providers: [provideIcons({ lucideArrowRight })],
  selector: 'app-introduccion',
  templateUrl: './introduccion.component.html',
})
export class IntroduccionComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  protected readonly stats = [
    { value: 10, prefix: '+', suffix: '', label: 'Años de trayectoria' },
    { value: 1200, prefix: '+', suffix: '', label: 'Familias felices' },
    { value: 15, prefix: '', suffix: '', label: 'Proyectos entregados' },
    { value: 98, prefix: '', suffix: '%', label: 'Clientes satisfechos' },
  ];
  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        gsap.from('[data-reveal]', {
          autoAlpha: 0,
          y: 24,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: root.querySelector('[data-text]'),
            start: 'top 78%',
            once: true,
          },
        });

        gsap.from('[data-img]', {
          autoAlpha: 0,
          x: 88,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: root.querySelector('[data-images]'),
            start: 'top 78%',
            once: true,
          },
        });

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
            scrollTrigger: {
              trigger: root.querySelector('[data-stats]'),
              start: 'top 85%',
              once: true,
            },
          });
        });

        gsap.from('[data-stat]', {
          autoAlpha: 0,
          y: 20,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: root.querySelector('[data-stats]'),
            start: 'top 85%',
            once: true,
          },
        });
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
