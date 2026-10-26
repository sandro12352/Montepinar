import { afterRenderEffect, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowDown, lucideArrowRight, lucideCalendarDays } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { LoaderService } from '../../../../core/services/loader.service';
import { PROJECTS } from '../../data/projects.data';

@Component({
  imports: [NgIcon],
  providers: [provideIcons({ lucideArrowDown, lucideArrowRight, lucideCalendarDays })],
  selector: 'app-projects-hero',
  templateUrl: './projects-hero.component.html',
})
export class ProjectsHeroComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly loaderService = inject(LoaderService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly arches = [
    { project: PROJECTS[0], heightClass: 'h-[78%]' },
    { project: PROJECTS[1], heightClass: 'h-full' },
    { project: PROJECTS[2], heightClass: 'h-[64%]' },
  ];

  protected readonly facts = [
    { value: '3', label: 'Ubicaciones' },
    { value: '+6,000', label: 'Familias' },
    { value: '300 m²', label: 'Desde' },
  ];

  protected readonly marquee = ['Chancay', 'Huaral', 'Iquitos'];

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
          .fromTo('[data-reveal]', { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 })
          .fromTo(
            '[data-arch]',
            { autoAlpha: 0, yPercent: 14, clipPath: 'inset(100% 0% 0% 0% round 999px 999px 2rem 2rem)' },
            {
              autoAlpha: 1,
              yPercent: 0,
              clipPath: 'inset(0% 0% 0% 0% round 999px 999px 2rem 2rem)',
              duration: 1.2,
              stagger: 0.16,
              ease: 'power4.out',
            },
            0.25,
          )
          .fromTo('[data-arch-label]', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12 }, 1.1)
          .fromTo('[data-spinner]', { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'back.out(1.8)' }, 1.2);

        // Las imágenes flotan suavemente, cada una a su ritmo.
        root.querySelectorAll<HTMLElement>('[data-float]').forEach((element, index) => {
          gsap.to(element, {
            y: index % 2 === 0 ? -10 : 10,
            duration: 3 + index * 0.6,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        });

        gsap.to('[data-spinner-ring]', { rotate: 360, duration: 14, ease: 'none', repeat: -1 });
        gsap.to('[data-marquee-track]', { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
