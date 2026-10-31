import { afterRenderEffect, Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight, lucideMaximize2, lucideX } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { GALLERY_FILTERS, GALLERY_PHOTOS, GalleryCategory } from '../../data/gallery.data';

/** Tamaños que se repiten cada 7 fotos y encajan exacto en 4 columnas × 3 filas. */
const BENTO_SPANS = [
  'col-span-2 row-span-2',
  '',
  '',
  'row-span-2',
  '',
  'col-span-2',
  '',
] as const;

const CATEGORY_LABEL: Record<GalleryCategory, string> = {
  proyecto: 'Proyecto',
  visitas: 'Visita guiada',
  clientes: 'Clientes',
  nosotros: 'Nosotros',
};

@Component({
  imports: [NgIcon],
  providers: [provideIcons({ lucideChevronLeft, lucideChevronRight, lucideMaximize2, lucideX })],
  selector: 'app-gallery-grid',
  styleUrl: './gallery-grid.component.css',
  templateUrl: './gallery-grid.component.html',
})
export class GalleryGridComponent {
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly filters = GALLERY_FILTERS;
  protected readonly active = signal<'todas' | GalleryCategory>('todas');
  protected readonly selected = signal<number | null>(null);

  protected readonly photos = computed(() => {
    const filter = this.active();
    return filter === 'todas' ? GALLERY_PHOTOS : GALLERY_PHOTOS.filter((photo) => photo.category === filter);
  });

  protected readonly current = computed(() => {
    const index = this.selected();
    return index === null ? null : (this.photos()[index] ?? null);
  });

  constructor() {
    // Al cambiar de filtro (y la primera vez) las fotos entran escalonadas.
    afterRenderEffect(() => {
      this.photos();
      const tiles = this.root().nativeElement.querySelectorAll('[data-tile]');
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.fromTo(
        tiles,
        { autoAlpha: 0, y: 36, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.04, ease: 'power3.out', overwrite: 'auto', clearProps: 'transform' },
      );
    });
  }

  protected spanFor(index: number): string {
    return BENTO_SPANS[index % BENTO_SPANS.length];
  }

  protected labelFor(category: GalleryCategory): string {
    return CATEGORY_LABEL[category];
  }

  protected setFilter(id: 'todas' | GalleryCategory): void {
    this.active.set(id);
  }

  protected open(index: number): void {
    this.selected.set(index);
    this.dialog().nativeElement.showModal();
  }

  protected close(): void {
    const dialog = this.dialog().nativeElement;
    if (dialog.open) dialog.close();
  }

  protected step(direction: 1 | -1): void {
    const total = this.photos().length;
    const index = this.selected();
    if (index === null || !total) return;
    this.selected.set((index + direction + total) % total);
  }

  protected onClose(): void {
    this.selected.set(null);
  }

  protected closeOnBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.close();
  }
}
