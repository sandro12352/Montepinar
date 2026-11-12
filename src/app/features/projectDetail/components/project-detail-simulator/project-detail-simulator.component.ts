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
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VisitSheetService } from '../../../../core/services/visit-sheet.service';
import { PriceRow } from '../../data/price-list.data';
import { LotPlan, ProjectDetail } from '../../data/project-detail.data';
import { formatSoles, prefersReducedMotion } from '../../utils/reveal';
import { whatsappLink } from '../../../contact/data/contact.data';

gsap.registerPlugin(ScrollTrigger);

type LotPick = NonNullable<LotPlan['pick']>;

interface LotOption {
  readonly id: string;
  readonly area: number;
  readonly row: PriceRow;
}

@Component({
  imports: [NgIcon, HlmSelectImports],
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

  // ── Proyectos con lista de precios: se simula sobre una fila real de la lista ─────────────
  protected readonly sectors = computed(() => this.project().sectors ?? []);
  private readonly planPick = computed(() => this.project().plans[this.selectedPlan()]?.pick ?? null);

  protected readonly sectorIndex = linkedSignal(() => this.planPick()?.sector ?? 0);
  protected readonly stageIndex = linkedSignal<{ sector: number; pick: LotPick | null }, number>({
    source: () => ({ sector: this.sectorIndex(), pick: this.planPick() }),
    computation: ({ sector, pick }) => (pick && pick.sector === sector ? pick.stage : 0),
  });
  protected readonly sector = computed(() => this.sectors()[this.sectorIndex()]);
  protected readonly stage = computed(() => this.sector()?.stages[this.stageIndex()]);

  /** Todos los lotes de la etapa elegida, con su área. */
  protected readonly lotOptions = computed<readonly LotOption[]>(() =>
    (this.stage()?.groups ?? []).flatMap((group, gi) => group.rows.map((row, ri) => ({ id: `${gi}-${ri}`, area: group.area, row }))),
  );
  protected readonly areas = computed(() => [...new Set(this.lotOptions().map((option) => option.area))]);

  protected readonly lotId = linkedSignal<{ sector: number; stage: number; pick: LotPick | null }, string>({
    source: () => ({ sector: this.sectorIndex(), stage: this.stageIndex(), pick: this.planPick() }),
    computation: ({ sector, stage, pick }) => (pick && pick.sector === sector && pick.stage === stage ? `${pick.group}-${pick.row}` : '0-0'),
  });
  protected readonly lot = computed(() => this.lotOptions().find((option) => option.id === this.lotId()) ?? this.lotOptions()[0]);

  protected optionsOfArea(area: number): readonly LotOption[] {
    return this.lotOptions().filter((option) => option.area === area);
  }

  // ── Proyectos sin lista de precios: se simula sobre el precio del plan ───────────────────
  protected readonly planIndex = linkedSignal(() => this.selectedPlan());
  protected readonly plan = computed(() => this.project().plans[this.planIndex()] ?? this.project().plans[0]);

  // ── Inicial y plazo (ambos modos) ────────────────────────────────────────────────────────
  protected readonly initialPercent = linkedSignal(() => this.project().financing.minInitialPercent);
  protected readonly months = linkedSignal(() => this.project().financing.maxMonths);

  protected readonly monthOptions = computed(() => {
    const max = this.project().financing.maxMonths;
    // Siempre incluye el plazo máximo del proyecto.
    return [...new Set([...[12, 24, 36, 48, 60].filter((value) => value < max), max])];
  });

  protected readonly result = computed(() => {
    const lot = this.lot();
    if (lot) {
      // Con lista de precios no hay variantes: inicial, cuotas y monto son los que publica el documento.
      const { row } = lot;
      const financed = row.financed - row.initial;
      return { price: row.cash, financedPrice: row.financed, initial: row.initial, financed, installment: row.installment, total: row.initial + row.installment * row.months };
    }

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

    return { price, financedPrice: price, initial, financed, installment, total: initial + installment * months };
  });

  /** Valores que se muestran: se animan hacia `result` cada vez que cambian los datos. */
  private readonly animated = signal<{ initial: number; financed: number; installment: number; total: number } | null>(null);
  protected readonly shown = computed(() => this.animated() ?? this.result());

  protected readonly initialShare = computed(() => {
    const { initial, financedPrice } = this.result();
    return Math.min(100, (initial / financedPrice) * 100);
  });
  protected readonly initialPct = computed(() => Math.round(this.initialShare()));

  protected whatsappLink(): string {
    const { installment } = this.result();
    const lot = this.lot();
    const what = lot
      ? `lote de ${lot.area} m² (${this.sector().name} · ${this.stage()?.label}, ${lot.row.location})`
      : `${this.plan().name} (${this.plan().area} m²)`;
    const message = `Hola, simulé el ${what} de ${this.project().name}: inicial ${formatSoles(this.result().initial)} y ${this.lot()?.row.months ?? this.months()} cuotas de ${formatSoles(installment)}. Quisiera más información.`;
    return whatsappLink(message);
  }

  protected openVisit(): void {
    this.visitSheet.open();
  }

  protected setInitial(event: Event): void {
    this.initialPercent.set(Number((event.target as HTMLInputElement).value));
  }

  protected selectSector(index: number): void {
    this.sectorIndex.set(index);
  }

  /** Texto que muestra el selector para el id de un lote (si no, mostraría "0-1"). */
  protected readonly lotLabel = (id: unknown): string => {
    const option = this.lotOptions().find((item) => item.id === id);
    return option ? `${option.row.location} · ${formatSoles(option.row.cash)}` : '';
  };

  protected selectLot(value: unknown): void {
    if (typeof value === 'string') this.lotId.set(value);
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
