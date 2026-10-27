import { afterRenderEffect, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendarDays, lucideUsers } from '@ng-icons/lucide';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { gsap } from 'gsap';
import { LoaderService } from '../../../../core/services/loader.service';
import { VisitSheetService } from '../../../../core/services/visit-sheet.service';

@Component({
  imports: [NgIcon, HlmBreadcrumbImports],
  providers: [provideIcons({ lucideCalendarDays, lucideUsers })],
  selector: 'app-team-hero',
  templateUrl: './team-hero.component.html',
})
export class TeamHeroComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly loaderService = inject(LoaderService);
  private readonly visitSheet = inject(VisitSheetService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly teamPhoto = '/images/equipo/team.png';

  private animated = false;

  protected openVisit(): void {
    this.visitSheet.open();
  }

  constructor() {
    afterRenderEffect(() => {
      if (!this.loaderService.ready() || this.animated) return;
      this.animated = true;

      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const timeline = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 });
        timeline
          .fromTo('[data-reveal]', { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.1 })
          .fromTo('[data-img]', { yPercent: 12, autoAlpha: 0, scale: 0.94, transformOrigin: '50% 100%' }, { yPercent: 0, autoAlpha: 1, scale: 1, duration: 1.4, ease: 'power4.out' }, 0.3)
          .fromTo('[data-tag]', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 1.3);

        // La etiqueta flota despacio para que el banner no quede quieto.
        gsap.to('[data-tag]', { y: -8, duration: 2.4, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2.2 });
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
