import { afterNextRender, Component, computed, DestroyRef, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBadgeCheck,
  lucideBuilding2,
  lucideClock,
  lucideDownload,
  lucideDroplets,
  lucideExternalLink,
  lucideFileSignature,
  lucideFileText,
  lucideHandshake,
  lucideLandmark,
  lucideLayers,
  lucideMap,
  lucideRefreshCw,
  lucideScrollText,
} from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LEGAL_PROJECTS, LegalDocument, LegalProject } from '../../data/legal-information.data';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon],
  providers: [
    provideIcons({
      lucideBadgeCheck,
      lucideBuilding2,
      lucideClock,
      lucideDownload,
      lucideDroplets,
      lucideExternalLink,
      lucideFileSignature,
      lucideFileText,
      lucideHandshake,
      lucideLandmark,
      lucideLayers,
      lucideMap,
      lucideRefreshCw,
      lucideScrollText,
    }),
  ],
  selector: 'app-legal-information-documents',
  templateUrl: './legal-information-documents.component.html',
})
export class LegalInformationDocumentsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly projects = LEGAL_PROJECTS;
  // Abre en el proyecto que ya tiene documentos cargados.
  protected readonly selected = signal<LegalProject>(LEGAL_PROJECTS.find((project) => project.documents.length) ?? LEGAL_PROJECTS[0]);

  /** Documento abierto en el visor. Al cambiar de proyecto vuelve al primero disponible. */
  protected readonly docIndex = signal(0);
  protected readonly doc = computed<LegalDocument | undefined>(() => this.selected().documents[this.docIndex()]);
  protected readonly availableCount = computed(() => this.selected().documents.filter((d) => d.file).length);

  /** Los móviles no incrustan PDF de forma fiable: ahí solo se ofrece abrir o descargar. */
  protected readonly canEmbed = signal(false);

  /** Visor nativo del navegador sin barras laterales, con la página completa visible. */
  protected readonly viewerUrl = computed<SafeResourceUrl | null>(() => {
    const file = this.doc()?.file;
    return file ? this.sanitizer.bypassSecurityTrustResourceUrl(`${file}#toolbar=0&navpanes=0&view=Fit`) : null;
  });

  private ready = false;

  protected select(project: LegalProject): void {
    this.selected.set(project);
    this.docIndex.set(Math.max(0, project.documents.findIndex((d) => d.file)));
  }

  protected open(index: number): void {
    if (this.selected().documents[index]?.file) this.docIndex.set(index);
  }

  constructor() {
    this.docIndex.set(Math.max(0, this.selected().documents.findIndex((d) => d.file)));

    afterNextRender(() => {
      const root = this.root().nativeElement;
      const mm = gsap.matchMedia(root);

      this.canEmbed.set(window.matchMedia('(min-width: 1024px)').matches);
      const embedQuery = window.matchMedia('(min-width: 1024px)');
      const onChange = (e: MediaQueryListEvent) => this.canEmbed.set(e.matches);
      embedQuery.addEventListener('change', onChange);

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-head]',
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: root, start: 'top 80%', once: true } },
        );
      });

      this.ready = true;
      this.destroyRef.onDestroy(() => {
        mm.revert();
        embedQuery.removeEventListener('change', onChange);
      });
    });

    // Al cambiar de proyecto, la lista entra en cascada.
    effect(() => {
      this.selected();
      if (!this.ready || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      queueMicrotask(() => {
        gsap.fromTo(
          this.root().nativeElement.querySelectorAll('[data-item]'),
          { autoAlpha: 0, x: -18 },
          { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out', overwrite: true },
        );
      });
    });

    // Al cambiar de documento, el visor se desvanece suavemente.
    effect(() => {
      this.doc();
      if (!this.ready || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      queueMicrotask(() => {
        gsap.fromTo(
          this.root().nativeElement.querySelectorAll('[data-viewer]'),
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', overwrite: true },
        );
      });
    });
  }
}
