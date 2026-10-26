import {
  afterNextRender,
  afterRenderEffect,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideCalendarDays, lucideMessageCircle } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VisitSheetService } from '../../../../core/services/visit-sheet.service';
import { ProjectDetail } from '../../data/project-detail.data';
import { formatSoles, prefersReducedMotion } from '../../utils/reveal';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon],
  providers: [provideIcons({ lucideArrowRight, lucideCalendarDays, lucideMessageCircle })],
  selector: 'app-project-detail-simulator',
  templateUrl: './project-detail-simulator.component.html',
})
export class ProjectDetailSimulatorComponent {
  readonly project = input.required<ProjectDetail>();
  /** Plan elegido desde la sección de planes. */
  readonly selectedPlan = input<number>(0);

  private readonly destroyRef = inject(DestroyRef);
  private readonly visitSheet = inject(VisitSheetService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly formatSoles = formatSoles;

  protected readonly planIndex = linkedSignal(() => this.selectedPlan());
  protected readonly initialPercent = linkedSignal(() => this.project().financing.minInitialPercent);
  protected readonly months = linkedSignal(() => this.project().financing.maxMonths);

  protected readonly monthOptions = computed(() => {
    const max = this.project().financing.maxMonths;
    return [12, 24, 36, 48, 60].filter((value) => value <= max);
  });

  protected readonly plan = computed(() => this.project().plans[this.planIndex()] ?? this.project().plans[0]);

  protected readonly result = computed(() => {
    const price = this.plan().price;
    const initial = Math.round((price * this.initialPercent()) / 100);
    const financed = price - initial;
    const months = this.months();
    const annualRate = this.project().financing.annualRate;

    let installment = financed / months;
    if (annualRate > 0) {
      const monthlyRate = Math.pow(1 + annualRate / 100, 1 / 12) - 1;
      installment = (financed * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    }

    return { price, initial, financed, installment, total: initial + installment * months };
  });

  /** Valores que se muestran: se animan hacia `result` cada vez que cambian los datos. */
  private readonly animated = signal<{ initial: number; financed: number; installment: number; total: number } | null>(null);
  protected readonly shown = computed(() => this.animated() ?? this.result());

  protected readonly initialShare = computed(() => this.initialPercent());

  protected whatsappLink(): string {
    const { installment } = this.result();
    const message = `Hola, simulé el ${this.plan().name} (${this.plan().area} m²) de ${this.project().location}: inicial ${this.initialPercent()}% y ${this.months()} cuotas de ${formatSoles(installment)}. Quisiera más información.`;
    return `https://wa.me/51932284185?text=${encodeURIComponent(message)}`;
  }

  protected openVisit(): void {
    this.visitSheet.open();
  }

  protected setInitial(event: Event): void {
    this.initialPercent.set(Number((event.target as HTMLInputElement).value));
  }

  constructor() {
    afterRenderEffect((onCleanup) => {
      const target = this.result();
      if (prefersReducedMotion()) {
        this.animated.set(target);
        return;
      }

      const from = { ...this.shown() };
      const tween = gsap.to(from, {
        initial: target.initial,
        financed: target.financed,
        installment: target.installment,
        total: target.total,
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: () => this.animated.set({ ...from }),
      });

      onCleanup(() => tween.kill());
    });

    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (prefersReducedMotion()) return;

        gsap.fromTo(
          '[data-reveal]',
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.09, ease: 'power3.out', scrollTrigger: { trigger: root, start: 'top 75%', once: true } },
        );
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
