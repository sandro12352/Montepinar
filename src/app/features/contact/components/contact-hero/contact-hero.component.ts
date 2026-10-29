import { afterRenderEffect, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { gsap } from 'gsap';
import { LoaderService } from '../../../../core/services/loader.service';

@Component({
  imports: [HlmBreadcrumbImports],
  selector: 'app-contact-hero',
  templateUrl: './contact-hero.component.html',
})
export class ContactHeroComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly loaderService = inject(LoaderService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  private animated = false;

  constructor() {
    afterRenderEffect(() => {
      if (!this.loaderService.ready() || this.animated) return;
      this.animated = true;

      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const timeline = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 });
        timeline
          .fromTo('[data-reveal]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 })
          .fromTo('[data-word]', { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'power4.out' }, 0.15);

        gsap.to('[data-orb]', { scale: 1.1, duration: 4, ease: 'sine.inOut', repeat: -1, yoyo: true });
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
