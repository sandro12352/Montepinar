import { afterNextRender, Component, DestroyRef, ElementRef, inject, input, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { lucideCalendarDays, lucideMessageCircle } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { LoaderService } from '../../../../core/services/loader.service';
import { VisitSheetService } from '../../../../core/services/visit-sheet.service';
import { ProjectDetail } from '../../data/project-detail.data';
import { formatSoles, prefersReducedMotion } from '../../utils/reveal';

@Component({
  imports: [NgIcon, HlmBreadcrumbImports],
  providers: [provideIcons({ lucideCalendarDays, lucideMessageCircle })],
  selector: 'app-project-detail-hero',
  templateUrl: './project-detail-hero.component.html',
})
export class ProjectDetailHeroComponent {
  readonly project = input.required<ProjectDetail>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly loaderService = inject(LoaderService);
  private readonly visitSheet = inject(VisitSheetService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly price = () => formatSoles(Math.min(...this.project().plans.map((plan) => plan.price)));

  protected whatsappLink(): string {
    const message = `Hola, quisiera información del proyecto de ${this.project().location}.`;
    return `https://wa.me/51932284185?text=${encodeURIComponent(message)}`;
  }

  protected openVisit(): void {
    this.visitSheet.open();
  }

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (prefersReducedMotion()) return;

        // La imagen de fondo respira lentamente, como en el banner principal.
        gsap.fromTo('[data-hero-zoom]', { scale: 1 }, { scale: 1.12, duration: 14, ease: 'none', repeat: -1, yoyo: true });

        const timeline = gsap.timeline({ defaults: { ease: 'power3.out' }, paused: true, delay: 0.15 });
        timeline
          .fromTo('[data-reveal]', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.1 })
          .fromTo('[data-fact]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.7);

        const play = () => timeline.play();
        if (this.loaderService.ready()) play();
        else {
          const interval = setInterval(() => {
            if (this.loaderService.ready()) {
              clearInterval(interval);
              play();
            }
          }, 100);
          this.destroyRef.onDestroy(() => clearInterval(interval));
        }
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
