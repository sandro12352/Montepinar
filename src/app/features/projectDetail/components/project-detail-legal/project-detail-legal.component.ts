import { afterNextRender, afterRenderEffect, Component, computed, DestroyRef, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideDownload,
  lucideExternalLink,
  lucideFileCheck,
  lucideFileText,
  lucideLandmark,
  lucideMap,
  lucideScrollText,
  lucideShieldCheck,
} from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProjectDetail } from '../../data/project-detail.data';
import { prefersReducedMotion } from '../../utils/reveal';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon],
  providers: [
    provideIcons({ lucideDownload, lucideExternalLink, lucideFileCheck, lucideFileText, lucideLandmark, lucideMap, lucideScrollText, lucideShieldCheck }),
  ],
  selector: 'app-project-detail-legal',
  templateUrl: './project-detail-legal.component.html',
})
export class ProjectDetailLegalComponent {
  readonly project = input.required<ProjectDetail>();

  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly viewer = viewChild<ElementRef<HTMLElement>>('viewer');

  protected readonly selectedIndex = signal(0);
  protected readonly selected = computed(() => this.project().legal[this.selectedIndex()]);

  /** PDF embebido sin barra lateral del visor, para que se vea limpio dentro de la página. */
  protected readonly viewerUrl = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(`${this.selected().file}#toolbar=0&navpanes=0&view=FitH`),
  );

  protected select(index: number): void {
    this.selectedIndex.set(index);
  }

  constructor() {
    // El visor se desliza suavemente cada vez que cambia el documento.
    afterRenderEffect(() => {
      this.selectedIndex();
      const viewer = this.viewer()?.nativeElement;
      if (!viewer || prefersReducedMotion()) return;
      gsap.fromTo(viewer, { autoAlpha: 0.3, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' });
    });

    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (prefersReducedMotion()) return;

        gsap.fromTo(
          '[data-reveal]',
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: root, start: 'top 78%', once: true } },
        );
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
