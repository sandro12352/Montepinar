import { afterNextRender, Component, computed, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideMapPin, lucideNavigation } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getProjectDetail } from '../../../projectDetail/data/project-detail.data';
import { PROJECTS } from '../../../projects/data/projects.data';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon, RouterLink],
  providers: [provideIcons({ lucideArrowRight, lucideMapPin, lucideNavigation })],
  selector: 'app-contact-map',
  templateUrl: './contact-map.component.html',
})
export class ContactMapComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly projects = PROJECTS.map((project) => ({
    ...project,
    mapQuery: getProjectDetail(project.slug)?.mapQuery ?? `${project.location}, Perú`,
  }));
  protected readonly activeIndex = signal(0);
  protected readonly active = computed(() => this.projects[this.activeIndex()]);

  protected readonly mapUrl = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.google.com/maps?q=${encodeURIComponent(this.active().mapQuery)}&z=11&output=embed`,
    ),
  );
  protected readonly directionsUrl = computed(
    () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.active().mapQuery)}`,
  );

  protected select(index: number): void {
    if (index === this.activeIndex()) return;
    const root = this.root().nativeElement;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.activeIndex.set(index);
      return;
    }

    // El mapa y la ficha se atenúan, cambian de proyecto y vuelven a aparecer.
    gsap.to(root.querySelectorAll('[data-swap]'), {
      autoAlpha: 0,
      y: 10,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        this.activeIndex.set(index);
        gsap.to(root.querySelectorAll('[data-swap]'), { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.15 });
      },
    });
  }

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const mm = gsap.matchMedia(root);

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-head]',
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '[data-heading]', start: 'top 82%', once: true } },
        );
        gsap.fromTo(
          '[data-map]',
          { autoAlpha: 0, clipPath: 'inset(10% 6% 10% 6% round 3rem)', scale: 0.96 },
          { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0% round 1.75rem)', scale: 1, duration: 1.2, ease: 'power4.out', clearProps: 'clipPath', scrollTrigger: { trigger: '[data-map]', start: 'top 82%', once: true } },
        );
        gsap.fromTo(
          '[data-info]',
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 0.9, delay: 0.5, ease: 'power3.out', scrollTrigger: { trigger: '[data-map]', start: 'top 82%', once: true } },
        );
      });

      this.destroyRef.onDestroy(() => mm.revert());
    });
  }
}
