import { afterNextRender, Component, DestroyRef, ElementRef, inject, input, output, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideCalculator, lucideRuler } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProjectDetail } from '../../data/project-detail.data';
import { formatSoles, prefersReducedMotion } from '../../utils/reveal';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon],
  providers: [provideIcons({ lucideArrowRight, lucideCalculator, lucideRuler })],
  selector: 'app-project-detail-plans',
  templateUrl: './project-detail-plans.component.html',
})
export class ProjectDetailPlansComponent {
  readonly project = input.required<ProjectDetail>();
  /** Índice del plan que el usuario quiere simular. */
  readonly planSelected = output<number>();

  protected readonly formatSoles = formatSoles;

  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected pricePerM2(price: number, area: number): string {
    return formatSoles(price / area);
  }

  protected simulate(index: number): void {
    this.planSelected.emit(index);
    document.getElementById('detalle-simulador')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (prefersReducedMotion()) return;

        gsap.fromTo(
          '[data-head]',
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: root, start: 'top 78%', once: true } },
        );

        root.querySelectorAll<HTMLElement>('[data-plan]').forEach((plan) => {
          const timeline = gsap.timeline({ scrollTrigger: { trigger: plan, start: 'top 82%', once: true } });
          timeline
            .fromTo(plan.querySelector('[data-line]'), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power3.out' })
            .fromTo(
              plan.querySelectorAll('[data-plan-item]'),
              { autoAlpha: 0, y: 26 },
              { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' },
              0.15,
            );
        });
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
