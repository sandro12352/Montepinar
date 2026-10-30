import { afterNextRender, Component, DestroyRef, ElementRef, effect, inject, signal, viewChild, viewChildren } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight, lucideExpand, lucideX } from '@ng-icons/lucide';
import { HlmCarousel, HlmCarouselImports } from '@spartan-ng/helm/carousel';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GalleryImage {
  readonly src: string;
  readonly alt: string;
}

@Component({
  imports: [HlmCarouselImports, NgIcon],
  providers: [provideIcons({ lucideChevronLeft, lucideChevronRight, lucideExpand, lucideX })],
  selector: 'app-gallery',
  styleUrl: './gallery.component.css',
  templateUrl: './gallery.component.html',
})
export class GalleryComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');
  private readonly galleryDialog = viewChild.required<ElementRef<HTMLDialogElement>>('galleryDialog');
  private readonly galleryItems = viewChildren<ElementRef<HTMLElement>>('galeryItem');
  private readonly dialogCarousel = viewChild<HlmCarousel>('dialogCarousel');
  private modalAnimation?: gsap.core.Timeline;
  private previousDialogSlide: number | null = null;

  protected readonly images: readonly GalleryImage[] = [
    { src: '/images/gallery/presentacion.webp', alt: 'Presentación del plano y las etapas del proyecto Montepinar' },
    { src: '/images/gallery/foto-grupal-mapa.png', alt: 'Clientes posando junto al plano de lotes de Montepinar' },
    { src: '/images/gallery/equipo-mapa.png', alt: 'El equipo de Montepinar explicando el plano de etapas y lotes' },
    { src: '/images/gallery/visita-ingreso.png', alt: 'Visitantes atentos a la explicación en el ingreso del proyecto' },
    { src: '/images/gallery/grupo-entrada.png', alt: 'Grupo de visitantes junto al módulo de ingreso de Montepinar' },
    { src: '/images/gallery/atencion-oficina.png', alt: 'Asesora atendiendo a clientes en la oficina de Montepinar' },
    { src: '/images/gallery/cliente-promocion.png', alt: 'Clienta con el brochure frente al panel de Montepinar Inmobiliaria & Constructora' },
    { src: '/images/gallery/bus-recojo.png', alt: 'Bus de la visita guiada con los asesores esperando en el punto de recojo' },
    { src: '/images/gallery/bus-llegada.png', alt: 'Bus de la visita llegando al módulo de atención de Montepinar' },
    { src: '/images/gallery/terreno-cabanas.png', alt: 'Terreno de Montepinar con módulos de obra y las montañas al fondo' },
    { src: '/images/gallery/modulos-colores.png', alt: 'Hilera de módulos de colores junto a una vía del proyecto' },
    { src: '/images/gallery/modulos-turquesa.png', alt: 'Vista amplia de los módulos de los propietarios en el terreno' },
    { src: '/images/gallery/casa-jardin.png', alt: 'Casa de un propietario con jardín y tanque de agua' },
    { src: '/images/gallery/casa-verde.png', alt: 'Casa verde con terraza construida por un propietario' },
    { src: '/images/gallery/cartel-mall.png', alt: 'Cartel del futuro Montepinar Mall, Sector 2 Etapa 2' },
    { src: '/images/gallery/mercado.png', alt: 'Recreación del futuro Mercado de Montepinar, Sector 4 Etapa 2' },
  ];

  protected readonly selectedIndex = signal<number | null>(null);
  protected openImage(index: number): void {
    this.selectedIndex.set(index);
    const dialog = this.galleryDialog().nativeElement;
    dialog.showModal();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.modalAnimation?.kill();
    this.modalAnimation = gsap.timeline({ paused: true }).fromTo(
      dialog,
      { autoAlpha: 0, y: 14, scale: 0.985 },
      { autoAlpha: 1, y: 0, scale: 1, duration:1, ease: 'power2.out', overwrite: true },
    );
    this.modalAnimation.restart();
  }

  protected closeGallery(): void {
    const dialog = this.galleryDialog().nativeElement;
    if (dialog.open) dialog.close();
  }

  protected onDialogClose(): void {
    this.selectedIndex.set(null);
    this.modalAnimation?.kill();
    gsap.set(this.galleryDialog().nativeElement, { clearProps: 'opacity,visibility,transform' });
  }

  protected closeOnBackdrop(event: MouseEvent): void {
    if (event.target === this.galleryDialog().nativeElement) this.closeGallery();
  }

  constructor() {
    effect(() => {
      const carousel = this.dialogCarousel();
      if (!carousel) {
        this.previousDialogSlide = null;
        return;
      }

      const currentSlide = carousel.currentSlide();
      if (this.previousDialogSlide === null) {
        this.previousDialogSlide = currentSlide;
        return;
      }
      if (this.previousDialogSlide === currentSlide) return;

      this.previousDialogSlide = currentSlide;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const image = this.galleryDialog().nativeElement.querySelectorAll<HTMLElement>('[data-dialog-image]')[currentSlide];
      if (image) {
        gsap.fromTo(image,
          { autoAlpha: 0.65, scale: 0.975, y: 8 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.38, ease: 'power2.out', overwrite: true },
        );
      }
    });

    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const heading = root.querySelector<HTMLElement>('[data-gallery-heading]');
        const items = this.galleryItems().map((item) => item.nativeElement);
        if (!reduceMotion && items.length) {
          gsap.fromTo(items,
            { autoAlpha: 0, y: 24, scale: 0.975 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 1,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: { trigger: items[0], start: 'top 84%', once: true },
            },
          );
        }
        if (!reduceMotion && heading) {
          gsap.fromTo(heading, { autoAlpha: 0, y: 24 }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: heading, start: 'top 82%', once: true },
          });
        }

      }, root);

      this.destroyRef.onDestroy(() => context.revert());
      this.destroyRef.onDestroy(() => this.modalAnimation?.kill());
    });
  }
}
