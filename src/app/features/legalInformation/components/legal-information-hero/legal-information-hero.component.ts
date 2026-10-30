import { afterRenderEffect, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideShieldCheck } from '@ng-icons/lucide';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { gsap } from 'gsap';
import { LoaderService } from '../../../../core/services/loader.service';

@Component({
  imports: [NgIcon, HlmBreadcrumbImports],
  providers: [provideIcons({ lucideShieldCheck })],
  selector: 'app-legal-information-hero',
  templateUrl: './legal-information-hero.component.html',
})
export class LegalInformationHeroComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly loaderService = inject(LoaderService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  private animated = false;

  constructor() {
    afterRenderEffect(() => {
      if (!this.loaderService.ready() || this.animated) return;
      this.animated = true;

      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        gsap.fromTo('[data-reveal]', { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out', delay: 0.15 });
      }, this.root().nativeElement);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
