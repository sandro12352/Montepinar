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
  output,
  viewChild,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalculator, lucideHouse, lucideMessageCircle, lucideTreePine } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { buildLotBlocks, Lot } from '../../data/lots.data';
import { ProjectDetail } from '../../data/project-detail.data';
import { formatSoles, prefersReducedMotion } from '../../utils/reveal';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon],
  providers: [provideIcons({ lucideCalculator, lucideHouse, lucideMessageCircle, lucideTreePine })],
  selector: 'app-project-detail-lots',
  templateUrl: './project-detail-lots.component.html',
})
export class ProjectDetailLotsComponent {
  readonly project = input.required<ProjectDetail>();
  /** Emite el índice del tipo de lote para llevarlo al simulador. */
  readonly planSelected = output<number>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly drawing = viewChild<ElementRef<HTMLElement>>('drawing');

  protected readonly formatSoles = formatSoles;
  protected readonly blocks = computed(() => buildLotBlocks(this.project()));
  protected readonly allLots = computed(() => this.blocks().flatMap((block) => block.rows.flat()));

  /** Lote seleccionado: por defecto, el primer lote disponible del segundo tipo (o del primero). */
  protected readonly selectedId = linkedSignal(() => {
    const lots = this.allLots();
    return (lots.find((lot) => lot.status === 'available' && lot.planIndex === 1) ?? lots[0]).id;
  });

  protected readonly selected = computed<Lot>(() => this.allLots().find((lot) => lot.id === this.selectedId()) ?? this.allLots()[0]);
  protected readonly planName = computed(() => this.project().plans[this.selected().planIndex].name);

  /** Proporción real del terreno para dibujar el lote a escala (limitada para que siempre se vea bien). */
  protected readonly drawingRatio = computed(() => {
    const { width, depth } = this.selected();
    return Math.min(Math.max(depth / width, 0.7), 1.6);
  });

  protected select(lot: Lot): void {
    if (lot.status === 'reserved') return;
    this.selectedId.set(lot.id);
  }

  protected simulate(): void {
    this.planSelected.emit(this.selected().planIndex);
    document.getElementById('detalle-simulador')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }

  protected whatsappLink(): string {
    const { id, area } = this.selected();
    const message = `Hola, me interesa el lote ${id} (${area} m²) del proyecto ${this.project().name}.`;
    return `https://wa.me/51932284185?text=${encodeURIComponent(message)}`;
  }

  protected planLink(): string {
    const message = `Hola, quisiera recibir el plano de lotes del proyecto ${this.project().name}.`;
    return `https://wa.me/51932284185?text=${encodeURIComponent(message)}`;
  }

  constructor() {
    // El dibujo del lote "respira" cada vez que se elige otro.
    afterRenderEffect(() => {
      this.selectedId();
      const drawing = this.drawing()?.nativeElement;
      if (!drawing || prefersReducedMotion()) return;
      gsap.fromTo(drawing, { scale: 0.86, autoAlpha: 0.4 }, { scale: 1, autoAlpha: 1, duration: 0.55, ease: 'back.out(1.8)' });
    });

    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (prefersReducedMotion()) return;

        gsap.fromTo(
          '[data-head]',
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: root, start: 'top 78%', once: true } },
        );

        gsap.fromTo(
          '[data-panel]',
          { autoAlpha: 0, y: 34 },
          { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.14, ease: 'power3.out', scrollTrigger: { trigger: '[data-panel]', start: 'top 85%', once: true } },
        );

        gsap.fromTo(
          '[data-lot], [data-zone]',
          { autoAlpha: 0, scale: 0.85 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.5,
            stagger: { amount: 0.9, from: 'start' },
            ease: 'back.out(1.6)',
            scrollTrigger: { trigger: '[data-map]', start: 'top 80%', once: true },
          },
        );
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
