import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBus, lucideCoffee, lucideFileSignature, lucideLandPlot, lucideMapPin, lucideMic, lucideUndo2 } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TOUR_STEPS } from '../../data/guided-tour.data';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon],
  providers: [provideIcons({ lucideBus, lucideCoffee, lucideFileSignature, lucideLandPlot, lucideMapPin, lucideMic, lucideUndo2 })],
  selector: 'app-guided-tour-journey',
  templateUrl: './guided-tour-journey.component.html',
})
export class GuidedTourJourneyComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly steps = TOUR_STEPS;

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
      });

      // Escritorio: la sección se fija y el recorrido avanza de lado con el scroll; el bus marca el progreso.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const viewport = root.querySelector<HTMLElement>('[data-viewport]')!;
        const track = root.querySelector<HTMLElement>('[data-track]')!;
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

        gsap.set(viewport, { overflowX: 'hidden' });

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: viewport,
            start: 'top 80px',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        timeline
          .to(track, { x: () => -distance() }, 0)
          .fromTo('[data-progress]', { scaleX: 0 }, { scaleX: 1 }, 0)
          .fromTo('[data-bus]', { left: '0%' }, { left: '100%' }, 0);

        // Cada imagen se desplaza un poco más lento que su panel para dar profundidad.
        gsap.utils.toArray<HTMLElement>('[data-parallax]', root).forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: 'none',
              scrollTrigger: { trigger: img.closest('[data-panel]'), containerAnimation: timeline, start: 'left right', end: 'right left', scrub: true },
            },
          );
        });
      });

      this.destroyRef.onDestroy(() => mm.revert());
    });
  }
}
