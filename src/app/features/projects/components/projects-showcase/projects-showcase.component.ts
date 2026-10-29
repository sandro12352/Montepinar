import { afterRenderEffect, Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpRight,
  lucideCalendarDays,
  lucideDroplets,
  lucideMapPin,
  lucideRuler,
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
import { VisitSheetService } from '../../../../core/services/visit-sheet.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS, ProjectItem } from '../../data/projects.data';

gsap.registerPlugin(ScrollTrigger);

type StatusFilter = 'Todos' | ProjectItem['status'];

@Component({
  imports: [NgIcon, RouterLink],
  providers: [
    provideIcons({
      lucideArrowUpRight,
      lucideCalendarDays,
      lucideDroplets,
      lucideMapPin,
      lucideRuler,
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
  selector: 'app-projects-showcase',
  templateUrl: './projects-showcase.component.html',
})
export class ProjectsShowcaseComponent {
  private readonly visitSheet = inject(VisitSheetService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly filters: readonly StatusFilter[] = ['Todos', 'En construcción', 'Próximamente'];
  protected readonly activeFilter = signal<StatusFilter>('Todos');

  protected readonly visibleProjects = computed(() => {
    const filter = this.activeFilter();
    return filter === 'Todos' ? PROJECTS : PROJECTS.filter((project) => project.status === filter);
  });

  protected countFor(filter: StatusFilter): number {
    return filter === 'Todos' ? PROJECTS.length : PROJECTS.filter((project) => project.status === filter).length;
  }

  protected selectFilter(filter: StatusFilter): void {
    this.activeFilter.set(filter);
  }

  protected openVisit(): void {
    this.visitSheet.open();
  }

  protected indexLabel(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  constructor() {
    // Se vuelve a construir cada vez que cambia el filtro, para animar las filas visibles.
    afterRenderEffect((onCleanup) => {
      this.visibleProjects();

      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        gsap.fromTo('[data-reveal]',
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: root.querySelector('[data-text]'), start: 'top 80%', once: true },
          },
        );

        root.querySelectorAll<HTMLElement>('[data-row]').forEach((row) => {
          const media = row.querySelector<HTMLElement>('[data-media]');
          const image = row.querySelector<HTMLElement>('[data-parallax]');
          const items = row.querySelectorAll<HTMLElement>('[data-row-item]');
          const number = row.querySelector<HTMLElement>('[data-number]');

          const timeline = gsap.timeline({
            scrollTrigger: { trigger: row, start: 'top 78%', once: true },
          });

          if (media) {
            timeline.fromTo(media,
              { autoAlpha: 0, clipPath: 'inset(14% 10% 14% 10% round 3rem)', scale: 0.96 },
              { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0% round 0rem)', scale: 1, duration: 1.2, ease: 'power4.out' },
            );
          }

          if (number) {
            timeline.fromTo(number, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.2);
          }

          timeline.fromTo(items,
            { autoAlpha: 0, y: 26 },
            { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.09, ease: 'power2.out' },
            0.35,
          );

          // La imagen se desplaza a otra velocidad que la página (profundidad suave).
          if (media && image) {
            gsap.fromTo(image,
              { yPercent: -7 },
              {
                yPercent: 7,
                ease: 'none',
                scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true },
              },
            );
          }

          if (number) {
            gsap.to(number, {
              yPercent: -18,
              ease: 'none',
              scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true },
            });
          }
        });
      }, root);

      ScrollTrigger.refresh();
      onCleanup(() => context.revert());
    });
  }
}
