import { afterRenderEffect, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideBadgeCheck, lucidePhone, lucideUsers } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { LoaderService } from '../../../../core/services/loader.service';

@Component({
  imports: [NgIcon],
  providers: [provideIcons({ lucideArrowRight, lucideBadgeCheck, lucidePhone, lucideUsers })],
  selector: 'app-about-hero',
  templateUrl: './about-hero.component.html',
})
export class AboutHeroComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly loaderService = inject(LoaderService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly trustCards = [
    { icon: 'lucideBadgeCheck', title: 'Proyectos verificados', text: 'Documentación y acompañamiento legal' },
    { icon: 'lucideUsers', title: '+1,200 familias', text: 'ya construyen su sueño con nosotros' },
  ];

  private animated = false;

  constructor() {
    afterRenderEffect(() => {
      if (!this.loaderService.ready() || this.animated) return;
      this.animated = true;

      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        gsap.fromTo('[data-reveal]',
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 0.15, ease: 'power2.out' },
        );

        gsap.fromTo('[data-hero-image]',
          { autoAlpha: 0, y: 56 },
          { autoAlpha: 1, y: 0, duration: 1, delay: 0.5, ease: 'power2.out' },
        );
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
