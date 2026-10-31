import { afterRenderEffect, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { gsap } from 'gsap';
import { LoaderService } from '../../../../core/services/loader.service';
import { GALLERY_PHOTOS } from '../../data/gallery.data';

@Component({
  imports: [HlmBreadcrumbImports],
  selector: 'app-gallery-hero',
  templateUrl: './gallery-hero.component.html',
})
export class GalleryHeroComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly loaderService = inject(LoaderService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly total = GALLERY_PHOTOS.length;

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
