import { afterRenderEffect, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBus, lucideCalendarDays, lucideCoffee, lucideFileSignature, lucideLandPlot } from '@ng-icons/lucide';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoaderService } from '../../../../core/services/loader.service';
import { VisitSheetService } from '../../../../core/services/visit-sheet.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon, HlmBreadcrumbImports],
  providers: [provideIcons({ lucideBus, lucideCalendarDays, lucideCoffee, lucideFileSignature, lucideLandPlot })],
  selector: 'app-guided-tour-hero',
  templateUrl: './guided-tour-hero.component.html',
})
export class GuidedTourHeroComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly loaderService = inject(LoaderService);
  private readonly visitSheet = inject(VisitSheetService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly perks = [
    { icon: 'lucideBus', label: 'Bus gratis', note: 'Ida y vuelta' },
    { icon: 'lucideCoffee', label: 'Desayuno y almuerzo', note: 'Invita Montepinar' },
    { icon: 'lucideLandPlot', label: 'Lotes en vivo', note: 'Recorrido guiado' },
    { icon: 'lucideFileSignature', label: 'Ayuda con el trámite', note: 'Si decides separar' },
  ];

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
          .fromTo('[data-img]', { scale: 1.25 }, { scale: 1.05, duration: 2.4, ease: 'power3.out' }, 0)
          .fromTo('[data-reveal]', { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.11 }, 0.15)
          .fromTo('[data-strip] li', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 }, 1.1);

        // Zoom muy lento y paralaje: el fondo se mueve menos que el texto al bajar.
        gsap.to('[data-img]', { scale: 1.12, duration: 16, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 2.4 });
        gsap.to('[data-bg]', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true } });
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
