import { NgOptimizedImage } from '@angular/common';
import { afterRenderEffect, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoaderService } from '../../../../core/services/loader.service';
import { ContactCtaComponent } from '../../../home/components/contact-cta/contact-cta.component';
import { PROJECTS } from '../../../projects/data/projects.data';
import { BLOG_POSTS, formatBlogDate } from '../../data/blog.data';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgOptimizedImage, RouterLink, HlmBreadcrumbImports, ContactCtaComponent],
  selector: 'app-blog',
  templateUrl: './blog.component.html',
})
export class BlogComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly loaderService = inject(LoaderService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  /** El primer artículo de la lista se muestra grande, como destacado. */
  protected readonly featured = BLOG_POSTS[0];
  protected readonly others = BLOG_POSTS.slice(1);
  protected readonly projects = PROJECTS;
  protected readonly formatDate = formatBlogDate;

  private animated = false;

  constructor() {
    afterRenderEffect(() => {
      if (!this.loaderService.ready() || this.animated) return;
      this.animated = true;

      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Entrada del hero, cuando termina el loader.
        gsap.fromTo(
          '[data-hero]',
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.15 },
        );

        // Las tarjetas aparecen al llegar a ellas, por grupos.
        // Se ocultan desde el inicio (batch no lo hace) para que no parpadeen antes de aparecer.
        gsap.set('[data-card]', { autoAlpha: 0, y: 36 });
        gsap.set('[data-fade]', { autoAlpha: 0, y: 24 });

        ScrollTrigger.batch('[data-card]', {
          start: 'top 88%',
          once: true,
          onEnter: (items) =>
            gsap.to(items, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', overwrite: true, clearProps: 'all' }),
        });

        ScrollTrigger.batch('[data-fade]', {
          start: 'top 85%',
          once: true,
          onEnter: (items) =>
            gsap.to(items, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out', overwrite: true, clearProps: 'all' }),
        });
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
