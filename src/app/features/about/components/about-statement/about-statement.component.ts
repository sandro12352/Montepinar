import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Word {
  readonly text: string;
  readonly accent: boolean;
}

@Component({
  selector: 'app-about-statement',
  templateUrl: './about-statement.component.html',
})
export class AboutStatementComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  /** La frase se parte en palabras para encenderlas una a una con el scroll. */
  protected readonly words: readonly Word[] = 'Donde familias, naturaleza y comunidad se encuentran.'
    .split(' ')
    .map((text) => ({ text, accent: text.startsWith('comunidad') }));

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.set('[data-word]', { opacity: 1 });
          return;
        }

        gsap.fromTo(
          '[data-word]',
          { opacity: 0.18, y: 14 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top 72%', end: 'center 45%', scrub: 0.6 },
          },
        );

        gsap.fromTo(
          '[data-after]',
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '[data-after]', start: 'top 88%', once: true } },
        );

        gsap.to('[data-orb]', { yPercent: -30, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } });
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
