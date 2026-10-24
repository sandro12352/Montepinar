import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about-statement',
  templateUrl: './about-statement.component.html',
})
export class AboutStatementComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

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
            duration: 0.8,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: { trigger: root, start: 'top 75%', once: true },
          },
        );
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
