import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideArrowUpRight,
  lucideCalendarDays,
  lucideDroplets,
  lucideMapPin,
  lucideRuler,
  lucideShieldCheck,
  lucideSprout,
  lucideSun,
  lucideTreePine,
  lucideTrophy,
  lucideUsers,
  lucideWaves,
  lucideZap,
} from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VisitSheetService } from '../../../../core/services/visit-sheet.service';
import { PROJECTS } from '../../../projects/data/projects.data';

gsap.registerPlugin(ScrollTrigger);

/** Duración total (en unidades de la línea de tiempo) y punto medio de cada proyecto. */
const TIMELINE_TOTAL = 3.4;
const PROJECT_STOPS = [0.4, 1.7, 3.0];

@Component({
  selector: 'app-home-projects',
  templateUrl: './projects.component.html',
  imports: [NgIcon, RouterLink],
  providers: [
    provideIcons({
      lucideArrowRight,
      lucideArrowUpRight,
      lucideCalendarDays,
      lucideDroplets,
      lucideMapPin,
      lucideRuler,
      lucideShieldCheck,
      lucideSprout,
      lucideSun,
      lucideTreePine,
      lucideTrophy,
      lucideUsers,
      lucideWaves,
      lucideZap,
    }),
  ],
})
export class HomeProjectsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly visitSheet = inject(VisitSheetService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly projects = PROJECTS;
  /** Proyecto que se muestra en el escenario fijo (escritorio). */
  protected readonly active = signal(0);

  private trigger: ScrollTrigger | null = null;

  protected indexLabel(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  protected openVisit(): void {
    this.visitSheet.open();
  }

  /** Lleva el scroll al tramo donde el proyecto elegido está en pantalla. */
  protected goTo(index: number): void {
    const trigger = this.trigger;
    if (!trigger) return;
    const top = trigger.start + (PROJECT_STOPS[index] / TIMELINE_TOTAL) * (trigger.end - trigger.start);
    window.scrollTo({ top, behavior: 'smooth' });
  }

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const mm = gsap.matchMedia(root);

      // Encabezado: siempre que no se pida reducir movimiento.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-head]',
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.09, ease: 'power3.out', scrollTrigger: { trigger: '[data-heading]', start: 'top 82%', once: true } },
        );
      });

      // Escritorio: el escenario se fija y el scroll cambia de proyecto.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const stage = root.querySelector<HTMLElement>('[data-stage]');
        if (!stage) return;

        const slides = gsap.utils.toArray<HTMLElement>('[data-slide]', stage);
        const images = gsap.utils.toArray<HTMLElement>('[data-slide-img]', stage);
        const panels = gsap.utils.toArray<HTMLElement>('[data-panel]', stage);
        const open = 'inset(0% 0% 0% 0% round 2rem)';

        gsap.set(slides.slice(1), { clipPath: 'inset(100% 0% 0% 0% round 2rem)' });
        gsap.set(slides[0], { clipPath: open });
        gsap.set(images, { scale: 1.2 });
        gsap.set(panels.slice(1), { autoAlpha: 0, y: 40 });

        const timeline = gsap.timeline({
          defaults: { ease: 'power2.inOut' },
          scrollTrigger: {
            trigger: stage,
            start: 'top 88px',
            end: '+=260%',
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            onUpdate: (self) => {
              const time = self.progress * TIMELINE_TOTAL;
              this.active.set(time < 1.05 ? 0 : time < 2.35 ? 1 : 2);
            },
          },
        });

        timeline.to({}, { duration: 0.8 });
        [0.8, 2.1].forEach((at, step) => {
          const next = step + 1;
          timeline
            .to(panels[step], { autoAlpha: 0, y: -40, duration: 0.3 }, at)
            .to(slides[next], { clipPath: open, duration: 0.5 }, at)
            .fromTo(images[next], { scale: 1.3 }, { scale: 1.1, duration: 0.8 }, at)
            .to(images[step], { scale: 1, duration: 0.6 }, at)
            .fromTo(panels[next], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.35 }, at + 0.25);
        });
        timeline.to({}, { duration: TIMELINE_TOTAL - timeline.duration() });
        timeline.fromTo('[data-progress]', { scaleX: 0.04 }, { scaleX: 1, duration: TIMELINE_TOTAL, ease: 'none' }, 0);

        this.trigger = timeline.scrollTrigger ?? null;
        return () => {
          this.trigger = null;
        };
      });

      // Móvil y tablet: lista editorial con revelado al hacer scroll.
      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        root.querySelectorAll<HTMLElement>('[data-item]').forEach((item) => {
          const media = item.querySelector('[data-item-media]');
          const image = item.querySelector('[data-item-img]');
          const lines = item.querySelectorAll('[data-item-line]');

          const timeline = gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 82%', once: true } });
          timeline
            .fromTo(media, { clipPath: 'inset(12% 8% 12% 8% round 2rem)', autoAlpha: 0 }, { clipPath: 'inset(0% 0% 0% 0% round 1.5rem)', autoAlpha: 1, duration: 1, ease: 'power4.out' })
            .fromTo(lines, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, 0.3);

          gsap.fromTo(image, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
      });

      this.destroyRef.onDestroy(() => mm.revert());
    });
  }
}
