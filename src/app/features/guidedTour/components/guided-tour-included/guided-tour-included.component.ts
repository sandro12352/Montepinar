import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBus, lucideFileSignature, lucidePresentation, lucideUtensils } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TOUR_INCLUSIONS } from '../../data/guided-tour.data';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon],
  providers: [provideIcons({ lucideBus, lucideFileSignature, lucidePresentation, lucideUtensils })],
  selector: 'app-guided-tour-included',
  templateUrl: './guided-tour-included.component.html',
})
export class GuidedTourIncludedComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly inclusions = TOUR_INCLUSIONS;

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const mm = gsap.matchMedia(root);

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-head]',
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '[data-heading]', start: 'top 82%', once: true } },
        );

        // El precio baja hasta S/ 0 al entrar en pantalla.
        const price = root.querySelector<HTMLElement>('[data-price]');
        if (price) {
          const counter = { value: 120 };
          gsap.to(counter, {
            value: 0,
            duration: 1.8,
            ease: 'power3.out',
            snap: { value: 1 },
            onUpdate: () => (price.textContent = String(counter.value)),
            scrollTrigger: { trigger: price, start: 'top 85%', once: true },
          });
        }

        gsap.fromTo(
          '[data-line]',
          { scaleX: 0 },
          { scaleX: 1, duration: 1, stagger: 0.14, ease: 'power3.inOut', scrollTrigger: { trigger: '[data-list]', start: 'top 80%', once: true } },
        );
        gsap.fromTo(
          '[data-row]',
          { autoAlpha: 0, x: 40 },
          { autoAlpha: 1, x: 0, duration: 0.8, stagger: 0.14, ease: 'power3.out', scrollTrigger: { trigger: '[data-list]', start: 'top 80%', once: true } },
        );
      });

      this.destroyRef.onDestroy(() => mm.revert());
    });
  }
}
