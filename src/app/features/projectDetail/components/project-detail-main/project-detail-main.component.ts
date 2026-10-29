import { afterNextRender, Component, computed, DestroyRef, ElementRef, inject, input, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCalendarDays,
  lucideClock,
  lucideDroplets,
  lucideFileText,
  lucideImages,
  lucideMessageCircle,
  lucideShieldCheck,
  lucideSprout,
  lucideSun,
  lucideTreePine,
  lucideStore,
  lucideTrophy,
  lucideUsers,
  lucideWaves,
  lucideZap,
} from '@ng-icons/lucide';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VisitSheetService } from '../../../../core/services/visit-sheet.service';
import { ProjectDetail } from '../../data/project-detail.data';
import { formatSoles, prefersReducedMotion } from '../../utils/reveal';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon, HlmDialogImports],
  providers: [
    provideIcons({
      lucideCalendarDays,
      lucideClock,
      lucideDroplets,
      lucideFileText,
      lucideImages,
      lucideMessageCircle,
      lucideShieldCheck,
      lucideSprout,
      lucideSun,
      lucideTreePine,
      lucideStore,
      lucideTrophy,
      lucideUsers,
      lucideWaves,
      lucideZap,
    }),
  ],
  selector: 'app-project-detail-main',
  templateUrl: './project-detail-main.component.html',
})
export class ProjectDetailMainComponent {
  readonly project = input.required<ProjectDetail>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly visitSheet = inject(VisitSheetService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly formatSoles = formatSoles;

  /** Lote de entrada: el de menor precio, que alimenta la tarjeta lateral. */
  protected readonly entryPlan = computed(() =>
    this.project().plans.reduce((min, plan) => (plan.price < min.price ? plan : min)),
  );

  protected readonly entryQuote = computed(() => {
    const plan = this.entryPlan();
    const { minInitialPercent, maxMonths } = this.project().financing;
    const initial = Math.round((plan.price * minInitialPercent) / 100);
    return {
      initialPercent: minInitialPercent,
      initial,
      months: maxMonths,
      installment: (plan.price - initial) / maxMonths,
      perM2: plan.price / plan.area,
    };
  });

  protected whatsappLink(message: string): string {
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

        gsap.fromTo(
          '[data-reveal]',
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: root, start: 'top 80%', once: true } },
        );

        gsap.fromTo(
          '[data-aside]',
          { autoAlpha: 0, x: 34 },
          { autoAlpha: 1, x: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: root, start: 'top 75%', once: true } },
        );

        root.querySelectorAll<HTMLElement>('[data-tile]').forEach((tile, index) => {
          gsap.fromTo(
            tile,
            { autoAlpha: 0, clipPath: 'inset(10% 8% 10% 8% round 2rem)', scale: 0.97 },
            {
              autoAlpha: 1,
              clipPath: 'inset(0% 0% 0% 0% round 1rem)',
              scale: 1,
              duration: 1.1,
              delay: index * 0.1,
              ease: 'power4.out',
              scrollTrigger: { trigger: tile, start: 'top 88%', once: true },
            },
          );
        });

        gsap.fromTo(
          '[data-essential]',
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out', scrollTrigger: { trigger: '[data-essentials]', start: 'top 85%', once: true } },
        );
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
