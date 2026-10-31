import { afterRenderEffect, ApplicationRef, Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight, lucideMaximize2, lucideX } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { GALLERY_FILTERS, GALLERY_PHOTOS, GalleryCategory, GalleryPhoto } from '../../data/gallery.data';

/** Filas del bento: cuántas fotos lleva cada una, su peso relativo de ancho y su alto en rem (escritorio). */
const BENTO_ROWS = [
  { grows: [2, 1, 1], height: 22 },
  { grows: [1, 1, 2], height: 16 },
  { grows: [1, 2], height: 20 },
  { grows: [1, 1, 1, 1], height: 14 },
] as const;

interface BentoTile {
  readonly photo: GalleryPhoto;
  readonly index: number;
  readonly grow: number;
}

interface BentoRow {
  readonly height: number;
  readonly tiles: BentoTile[];
}

/** Nombre compartido por la miniatura y la foto del visor: el navegador anima de una a la otra. */
const PHOTO_TRANSITION = 'gallery-photo';

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
  private readonly appRef = inject(ApplicationRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly filters = GALLERY_FILTERS;
  protected readonly active = signal<'todas' | GalleryCategory>('todas');
  protected readonly selected = signal<number | null>(null);

  protected readonly photos = computed(() => {
    const filter = this.active();
    return filter === 'todas' ? GALLERY_PHOTOS : GALLERY_PHOTOS.filter((photo) => photo.category === filter);
  });

  /** Reparte las fotos en filas; cada foto se queda con su ancho relativo y el hover lo reparte dentro de su fila. */
  protected readonly rows = computed<BentoRow[]>(() => {
    const photos = this.photos();
    const rows: BentoRow[] = [];
    let cursor = 0;
    for (let r = 0; cursor < photos.length; r++) {
      const def = BENTO_ROWS[r % BENTO_ROWS.length];
      const chunk = photos.slice(cursor, cursor + def.grows.length);
      const full = chunk.length === def.grows.length;
      rows.push({
        height: def.height,
        tiles: chunk.map((photo, i) => ({ photo, index: cursor + i, grow: full ? def.grows[i] : 1 })),
      });
      cursor += chunk.length;
    }
    // Una foto sola en la última fila se une a la anterior para no quedar a todo el ancho.
    const last = rows[rows.length - 1];
    if (rows.length > 1 && last.tiles.length === 1) {
      rows.pop();
      rows[rows.length - 1].tiles.push({ ...last.tiles[0], grow: 1 });
    }
    return rows;
  });

  /** Alto total fijo del bento: la suma de sus filas más los huecos (1rem). Así, al expandir una fila las demás ceden y nada se mueve. */
  protected readonly bentoHeight = computed(() => {
    const rows = this.rows();
    return rows.reduce((sum, row) => sum + row.height, 0) + Math.max(rows.length - 1, 0) + 'rem';
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

  protected labelFor(category: GalleryCategory): string {
    return CATEGORY_LABEL[category];
  }

  protected setFilter(id: 'todas' | GalleryCategory): void {
    this.active.set(id);
  }

  protected open(index: number, event: Event): void {
    const dialog = this.dialog().nativeElement;
    const thumb = (event.currentTarget as HTMLElement).querySelector('img');

    this.viewTransition(() => {
      thumb?.style.removeProperty('view-transition-name');
      this.selected.set(index);
      this.appRef.tick(); // pinta la foto del visor antes de que el navegador tome la imagen final
      dialog.showModal();
    }, thumb);
  }

  protected close(): void {
    const dialog = this.dialog().nativeElement;
    if (!dialog.open) return;

    const index = this.selected();
    const thumb = index === null ? null : this.root().nativeElement.querySelector<HTMLElement>('[data-tile-index="' + index + '"] img');
    const modalPhoto = dialog.querySelector<HTMLElement>('[data-modal-photo]');

    // La foto del visor "vuelve" a su miniatura.
    modalPhoto?.style.setProperty('view-transition-name', PHOTO_TRANSITION);
    this.viewTransition(() => {
      modalPhoto?.style.removeProperty('view-transition-name');
      thumb?.style.setProperty('view-transition-name', PHOTO_TRANSITION);
      dialog.close();
      this.selected.set(null);
      this.appRef.tick();
    }, null, thumb);
  }

  /** Envuelve un cambio de DOM en una View Transition si el navegador la soporta y no se pidió menos movimiento. */
  private viewTransition(update: () => void, from: HTMLElement | null, cleanup: HTMLElement | null = null): void {
    const supported = typeof document.startViewTransition === 'function';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!supported || reduced) {
      update();
      return;
    }

    // Antes del cambio, la miniatura de origen lleva el nombre; después lo lleva la foto del visor.
    from?.style.setProperty('view-transition-name', PHOTO_TRANSITION);
    const transition = document.startViewTransition(update);
    void transition.finished.finally(() => cleanup?.style.removeProperty('view-transition-name'));
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

  /** Esc también cierra con la transición en lugar del cierre seco del navegador. */
  protected onCancel(event: Event): void {
    event.preventDefault();
    this.close();
  }

  protected closeOnBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.close();
  }
}
