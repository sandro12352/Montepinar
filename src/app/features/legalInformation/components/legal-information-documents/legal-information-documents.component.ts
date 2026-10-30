import { afterNextRender, Component, DestroyRef, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideClock } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LEGAL_PROJECTS, LegalProject } from '../../data/legal-information.data';
import { LegalDocumentCardComponent } from '../legal-document-card/legal-document-card.component';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon, LegalDocumentCardComponent],
  providers: [provideIcons({ lucideClock })],
  selector: 'app-legal-information-documents',
  templateUrl: './legal-information-documents.component.html',
})
export class LegalInformationDocumentsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly projects = LEGAL_PROJECTS;
  // Abre en el proyecto que ya tiene documentos cargados.
  protected readonly selected = signal<LegalProject>(LEGAL_PROJECTS.find((project) => project.documents.length) ?? LEGAL_PROJECTS[0]);

  private ready = false;

  protected select(project: LegalProject): void {
    this.selected.set(project);
  }

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const mm = gsap.matchMedia(root);

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-head]',
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: root, start: 'top 80%', once: true } },
        );
      });

      this.ready = true;
      this.destroyRef.onDestroy(() => mm.revert());
    });

    // Al cambiar de proyecto, las tarjetas entran en cascada.
    effect(() => {
      this.selected();
      if (!this.ready || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      queueMicrotask(() => {
        gsap.fromTo(
          this.root().nativeElement.querySelectorAll('[data-card]'),
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out', overwrite: true },
        );
      });
    });
  }
}
