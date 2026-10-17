import {
  afterRenderEffect,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  untracked,
  viewChildren,
} from '@angular/core';
import { gsap } from 'gsap';
import { LoaderService } from '../../../core/services/loader.service';

interface ConfettiPiece {
  id: number;
  side: 'left' | 'right';
  offset: number;
  top: number;
  long: boolean;
  round: boolean;
  color: string;
}

const COLORS = ['#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#facc15'];

@Component({
  selector: 'app-anniversary-confetti',
  template: `
  @if (!finished()) {
      <div
        class="pointer-events-none fixed inset-0 z-[70] overflow-hidden"
        aria-hidden="true"
      >
        @for (piece of pieces; track piece.id) {
          <span
            #particle
            class="absolute block h-6 w-1 rounded-lg opacity-0 will-change-transform"
            [class.h-10]="piece.long"
            [class.w-2.5]="piece.long"
            [class.rounded-full]="piece.round"
            [style.left.%]="piece.side === 'left' ? piece.offset : null"
            [style.right.%]="piece.side === 'right' ? piece.offset : null"
            [style.top.%]="piece.top"
            [style.background-color]="piece.color"
          ></span>
        }
      </div>
    }
  `,
})
export class AnniversaryConfettiComponent {
  private readonly loader = inject(LoaderService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly particles = viewChildren<ElementRef<HTMLSpanElement>>('particle');

  readonly finished = signal(false);
  readonly pieces: ConfettiPiece[] = this.createPieces(250);

  private timeline?: gsap.core.Timeline;
  private started = false;

  constructor() {
    afterRenderEffect(() => {
      const ready = this.loader.ready(); // ajusta al API real de tu LoaderService
      const elements = this.particles();

       // Espera a que el loader termine y a que existan las partículas
    if (!ready || this.started || elements.length === 0) return;

      this.started = true;
      untracked(() => this.launch(elements.map((el) => el.nativeElement)));
    });

    this.destroyRef.onDestroy(() => this.timeline?.kill());
  }

  private createPieces(count: number): ConfettiPiece[] {
    return Array.from({ length: count }, (_, id) => ({
      id,
      side: id % 2 === 0 ? 'left' : 'right',
      offset: gsap.utils.random(-15, 10), // pegadas a los bordes laterales
      top: gsap.utils.random(20, 90),   // salen desde la mitad inferior de la pantalla
      long: Math.random() > 1,
      round: Math.random() > 0.8,
      color: COLORS[id % COLORS.length],
    }));
  }

  private launch(elements: HTMLElement[]): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.finished.set(true);
      return;
    }

    const w = window.innerWidth;
    const h = window.innerHeight;

    const tl = gsap.timeline({
      onComplete: () => this.finished.set(true),
    });
    this.timeline = tl;

    elements.forEach((el, i) => {
      const piece = this.pieces[i];
      // Desde la izquierda se empuja a la derecha, y desde la derecha hacia la izquierda
      const dir = piece.side === 'left' ? 1 : -1;

      const start = gsap.utils.random(0, 0.2);
      const burstDuration = gsap.utils.random(0.7, 1.1);
      const fallDuration = gsap.utils.random(1.8, 2.8);

      // 1) Explosión lateral: sale disparada hacia el centro y hacia arriba
      tl.fromTo(
        el,
        { opacity: 1, scale: 0.4, x: 0, y: 0, rotation: 0 },
        {
          x: dir * gsap.utils.random(w * 0.15, w * 0.45),
          y: -gsap.utils.random(h * 0.25, h * 0.6),
          rotation: gsap.utils.random(-540, 540),
          scale: 1,
          duration: burstDuration,
          ease: 'power3.out',
        },
        start,
      );

      // 2) Caída suave con balanceo, que se desvanece mientras cae
      tl.to(
        el,
        {
          y: `+=${gsap.utils.random(h * 0.3, h * 0.5)}`,
          x: `+=${dir * gsap.utils.random(20, 90)}`,
          rotation: `+=${gsap.utils.random(180, 540) * (Math.random() > 0.5 ? 1 : -1)}`,
          opacity: 0,
          duration: fallDuration,
          ease: 'power1.in',
        },
        start + burstDuration * 0.8,
      );
    });
  }
}
