import { afterNextRender, Component, computed, DestroyRef, ElementRef, inject, input, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideClock, lucideMapPin, lucideNavigation, lucideRoute } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ProjectDetail } from '../../data/project-detail.data';
import { prefersReducedMotion, revealOnScroll } from '../../utils/reveal';

@Component({
  imports: [NgIcon],
  providers: [provideIcons({ lucideClock, lucideMapPin, lucideNavigation, lucideRoute })],
  selector: 'app-project-detail-location',
  templateUrl: './project-detail-location.component.html',
})
export class ProjectDetailLocationComponent {
  readonly project = input.required<ProjectDetail>();

  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly mapUrl = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.google.com/maps?q=${encodeURIComponent(this.project().mapQuery)}&z=14&output=embed`,
    ),
  );

  protected readonly directionsUrl = computed(
    () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.project().mapQuery)}`,
  );

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (prefersReducedMotion()) return;
        revealOnScroll(root);

        gsap.fromTo(
          '[data-map]',
          { autoAlpha: 0, clipPath: 'inset(10% 6% 10% 6% round 3rem)', scale: 0.96 },
          { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0% round 1.5rem)', scale: 1, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: root, start: 'top 70%', once: true } },
        );
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
