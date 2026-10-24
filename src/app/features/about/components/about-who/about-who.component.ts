import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon],
  providers: [provideIcons({ lucideCheck })],
  selector: 'app-about-who',
  templateUrl: './about-who.component.html',
})
export class AboutWhoComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly points = [
    'Opciones de financiamiento directo',
    'Áreas verdes y espacios de recreación',
    'Acompañamiento legal en cada paso',
  ];

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        gsap.fromTo('[data-image]',
          { autoAlpha: 0, x: -88 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.95,
            ease: 'power1.inOut',
            scrollTrigger: { trigger: root.querySelector('[data-image]'), start: 'top 82%', once: true },
          },
        );

        gsap.fromTo('[data-reveal]',
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: root.querySelector('[data-text]'), start: 'top 78%', once: true },
          },
        );
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
