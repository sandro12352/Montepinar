import { afterRenderEffect, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideBadgeCheck, lucideCalendarDays, lucideUsers } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoaderService } from '../../../../core/services/loader.service';
import { VisitSheetService } from '../../../../core/services/visit-sheet.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon, RouterLink],
  providers: [provideIcons({ lucideArrowRight, lucideBadgeCheck, lucideCalendarDays, lucideUsers })],
  selector: 'app-about-hero',
  templateUrl: './about-hero.component.html',
})
export class AboutHeroComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly loaderService = inject(LoaderService);
  private readonly visitSheet = inject(VisitSheetService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly trustCards = [
    { icon: 'lucideBadgeCheck', title: 'Proyectos verificados', text: 'Documentación y acompañamiento legal' },
    { icon: 'lucideUsers', title: '+5,000 familias', text: 'ya construyen su sueño con nosotros' },
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

        gsap.fromTo(
          '[data-reveal]',
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.1, delay: 0.15, ease: 'power3.out' },
        );

        // La escena sube y se aclara al cargar; luego se mueve un poco más lento que la página.
        gsap.fromTo(
          '[data-media-img]',
          { autoAlpha: 0, yPercent: 8, scale: 1.06 },
          { autoAlpha: 1, yPercent: 0, scale: 1, duration: 1.8, delay: 0.4, ease: 'power3.out' },
        );
        gsap.to('[data-media]', {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
        });

        gsap.fromTo(
          '[data-card]',
          { autoAlpha: 0, y: 36 },
          { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.18, delay: 0.7, ease: 'power3.out' },
        );
        // Cada tarjeta sube y baja completa; una va hacia arriba mientras la otra va hacia abajo.
        gsap.utils.toArray<HTMLElement>('[data-float]').forEach((card, index) => {
          const distance = 14;
          gsap.fromTo(
            card,
            { y: index % 2 === 0 ? -distance : distance },
            { y: index % 2 === 0 ? distance : -distance, duration: 1.9, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.4 },
          );
        });
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
