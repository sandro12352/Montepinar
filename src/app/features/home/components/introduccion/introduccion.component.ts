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
  styleUrl: './introduccion.component.css',
  templateUrl: './introduccion.component.html',
})
export class IntroduccionComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

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

        gsap.from('[data-metric]', {
          autoAlpha: 0,
          y: 18,
          duration: 0.55,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: root.querySelector('[data-metric]'),
            start: 'top 88%',
            once: true,
          },
        });
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
