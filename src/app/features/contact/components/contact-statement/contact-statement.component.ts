import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VisitSheetService } from '../../../../core/services/visit-sheet.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon],
  providers: [provideIcons({ lucideArrowRight })],
  selector: 'app-contact-statement',
  templateUrl: './contact-statement.component.html',
})
export class ContactStatementComponent {
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
        const trigger = { trigger: root, start: 'top 70%', once: true };

        // Los círculos se abren desde su base y la frase sube desde una máscara.
        const timeline = gsap.timeline({ scrollTrigger: trigger });
        timeline
          .fromTo('[data-circle="big"]', { clipPath: 'circle(0% at 50% 100%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: 1.5, ease: 'power4.inOut', clearProps: 'clipPath' })
          .fromTo('[data-circle="big"] [data-img]', { scale: 1.4 }, { scale: 1, duration: 1.8, ease: 'power3.out' }, 0)
          .fromTo('[data-circle="small"]', { autoAlpha: 0, scale: 0.4, y: 60 }, { autoAlpha: 1, scale: 1, y: 0, duration: 1.1, ease: 'back.out(1.5)' }, 0.55)
          .fromTo('[data-word]', { yPercent: 115 }, { yPercent: 0, duration: 1, stagger: 0.12, ease: 'power4.out' }, 0.3)
          .fromTo('[data-fade]', { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, 1);

        // Los círculos se desplazan en sentidos opuestos con el scroll.
        gsap.to('[data-circle="big"]', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } });
        gsap.to('[data-circle="small"]', { yPercent: -14, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } });
      });

      this.destroyRef.onDestroy(() => mm.revert());
    });
  }
}
