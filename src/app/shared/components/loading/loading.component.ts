import { afterNextRender, afterRenderEffect, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { gsap } from 'gsap';
@Component({
  imports: [],
  selector: 'app-loading',
  styleUrl: './loading.component.css',
  templateUrl: './loading.component.html',
})
export class LoadingComponent {

  private readonly loadingService = inject(LoadingService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly percent = viewChild.required<ElementRef<HTMLElement>>('percent');
  private readonly phase = viewChild.required<ElementRef<HTMLElement>>('phase');

  protected readonly done = signal(false);
  private readonly introDone = signal(false);
  private exiting = false;
  private waiting?: gsap.core.Tween;
  private ctx?: gsap.Context;

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const percent = this.percent().nativeElement;
      const phase = this.phase().nativeElement;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduce) {
        percent.textContent = '100';
        phase.textContent = '¡Lo encontramos!';
        gsap.set('[data-progress]', { strokeDasharray: 1, strokeDashoffset: 0 });
        this.introDone.set(true);
        return;
      }

      const setPhase = (text: string) => {
        gsap
          .timeline()
          .to(phase, { opacity: 0, y: -8, duration: 0.2, ease: 'power1.in' })
          .add(() => (phase.textContent = text))
          .to(phase, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
      };

      this.ctx = gsap.context(() => {
        gsap.set('[data-draw]', { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set('[data-progress]', { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set('[data-plot]', { opacity: 0 });
        gsap.set('[data-logo]', { opacity: 0 });
        gsap.set('[data-house]', { scale: 0.6, transformOrigin: '50% 100%' });

        const counter = { v: 0 };

        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          onComplete: () => {
            this.waiting = gsap.to('[data-plot]', {
              opacity: 0.55,
              duration: 0.8,
              yoyo: true,
              repeat: -1,
              ease: 'sine.inOut',
            });
            this.introDone.set(true);
          },
        });

        tl
          // La casa crece durante toda la carga
          .to('[data-house]', { scale: 1.25, duration: 3.4, ease: 'power1.inOut' }, 0)

          // FASE 1: se dibuja la casa
          .to('[data-draw="ground"]', { strokeDashoffset: 0, duration: 0.6 }, 0.1)
          .to('[data-draw="body"]', { strokeDashoffset: 0, duration: 0.9, ease: 'power1.inOut' }, 0.3)
          .to('[data-draw="roof"]', { strokeDashoffset: 0, duration: 0.7, ease: 'power1.inOut' }, 0.9)
          .to('[data-draw="detail"]', { strokeDashoffset: 0, duration: 0.6, stagger: 0.12 }, 1.3)

          // El logo aparece en el techo cuando el techo ya está dibujado
          .to('[data-logo]', { opacity: 1, duration: 0.8, ease: 'power2.out' }, 1.5)

          // FASE 2
          .add(() => setPhase('Tu lote está cerca'), 1.5)
          .to('[data-plot]', { opacity: 1, duration: 0.7 }, 1.6)
          .from('[data-pin]', { y: -40, opacity: 0, duration: 0.7, ease: 'bounce.out' }, 1.9)

          // FASE 3
          .add(() => setPhase('¡Lo encontramos!'), 2.8)
          .to('[data-window]', { fill: '#ffc176', duration: 0.5, stagger: 0.1 }, 2.9)

          // Textos y anillo de progreso
          .from('[data-text]', { opacity: 0, y: 14, duration: 0.6, stagger: 0.1 }, 0.2)
          .to('[data-progress]', { strokeDashoffset: 0, duration: 3.4, ease: 'power1.inOut' }, 0)
          .to(counter, {
            v: 100,
            duration: 3.4,
            ease: 'power1.inOut',
            onUpdate: () => (percent.textContent = String(Math.round(counter.v))),
          }, 0);
      }, root);

      this.destroyRef.onDestroy(() => {
        this.waiting?.kill();
        this.ctx?.revert();
      });
    });

    afterRenderEffect(() => {
      if (this.loadingService.loading() || !this.introDone() || this.exiting) return;
      this.exiting = true;
      this.exit();
    });
  }

  private exit() {
    const q = gsap.utils.selector(this.root().nativeElement);
    this.waiting?.kill();

    gsap
      .timeline({ onComplete: () => this.done.set(true) })
      .to(q('[data-house]'), { scale: 5, opacity: 0, duration: 0.8, ease: 'power3.in', transformOrigin: '50% 70%' })
      .to(q('[data-fade]'), { opacity: 0, duration: 0.4, ease: 'power2.in' }, 0)
      .to(q('[data-panel="top"]'), { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '-=0.15')
      .to(q('[data-panel="bottom"]'), { yPercent: 100, duration: 0.9, ease: 'power4.inOut' }, '<');
  }
}
