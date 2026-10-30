import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TOUR_PHOTOS } from '../../data/guided-tour.data';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-guided-tour-gallery',
  templateUrl: './guided-tour-gallery.component.html',
})
export class GuidedTourGalleryComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly photos = TOUR_PHOTOS;

  constructor() {
    afterNextRender(() => {
      const mm = gsap.matchMedia(this.root().nativeElement);

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-head]',
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '[data-heading]', start: 'top 82%', once: true } },
        );
        gsap.fromTo(
          '[data-photo]',
          { autoAlpha: 0, y: 40, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '[data-grid]', start: 'top 82%', once: true } },
        );
      });

      this.destroyRef.onDestroy(() => mm.revert());
    });
  }
}
