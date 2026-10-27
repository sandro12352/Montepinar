import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideCalendarDays } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VisitSheetService } from '../../../../core/services/visit-sheet.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon, RouterLink],
  providers: [provideIcons({ lucideArrowRight, lucideCalendarDays })],
  selector: 'app-guided-tour-cta',
  templateUrl: './guided-tour-cta.component.html',
})
export class GuidedTourCtaComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly visitSheet = inject(VisitSheetService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected openVisit(): void {
    this.visitSheet.open();
  }

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const mm = gsap.matchMedia(root);

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const scrollTrigger = { trigger: '[data-panel]', start: 'top 78%', once: true };

        gsap.fromTo('[data-panel]', { autoAlpha: 0, y: 50, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out', scrollTrigger });
        gsap.fromTo('[data-copy]', { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 0.3, ease: 'power3.out', scrollTrigger });
        gsap.fromTo('[data-people]', { autoAlpha: 0, yPercent: 14 }, { autoAlpha: 1, yPercent: 0, duration: 1.2, delay: 0.4, ease: 'power4.out', scrollTrigger });

        // El bus se mece apenas, como si estuviera por salir.
        gsap.to('[data-people]', { y: -10, duration: 2.8, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2 });
        gsap.to('[data-orb]', { scale: 1.08, duration: 4, ease: 'sine.inOut', repeat: -1, yoyo: true });
      });

      this.destroyRef.onDestroy(() => mm.revert());
    });
  }
}
