import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBus, lucideCalendarDays, lucideFlag, lucideMapPin } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VisitSheetService } from '../../../../core/services/visit-sheet.service';
import { PICKUP_POINTS } from '../../data/guided-tour.data';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon],
  providers: [provideIcons({ lucideBus, lucideCalendarDays, lucideFlag, lucideMapPin })],
  selector: 'app-guided-tour-pickup',
  templateUrl: './guided-tour-pickup.component.html',
})
export class GuidedTourPickupComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly visitSheet = inject(VisitSheetService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly points = PICKUP_POINTS;

  protected openVisit(): void {
    this.visitSheet.open();
  }

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

        // El bus recorre la ruta con el scroll, rellena la línea y enciende cada parada al pasar.
        const stops = gsap.utils.toArray<HTMLElement>('[data-stop]', root);
        gsap.set(stops, { autoAlpha: 0.35 });
        gsap.set('[data-dot]', { scale: 0.7 });

        const route = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: '[data-route]', start: 'top 65%', end: 'bottom 70%', scrub: 0.6 },
        });
        route.fromTo('[data-fill]', { scaleY: 0 }, { scaleY: 1 }, 0).fromTo('[data-bus]', { top: '0%' }, { top: '100%' }, 0);

        stops.forEach((stop, i) => {
          const at = stops.length > 1 ? i / (stops.length - 1) : 0;
          route.to(stop, { autoAlpha: 1, duration: 0.06, ease: 'power2.out' }, Math.max(0, at - 0.03));
          route.to(stop.querySelector('[data-dot]'), { scale: 1, duration: 0.06, ease: 'back.out(2)' }, Math.max(0, at - 0.03));
        });
      });

      this.destroyRef.onDestroy(() => mm.revert());
    });
  }
}
