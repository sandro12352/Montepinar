import {
  afterRenderEffect,
  Component,
  ElementRef,
  viewChild,
  viewChildren,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBedDouble, lucideRuler } from '@ng-icons/lucide';
import { HlmCarousel, HlmCarouselImports } from '@spartan-ng/helm/carousel';
import { gsap } from 'gsap';

interface BannerSlide {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly action: string;
  readonly href: string;
  readonly theme: string;
  readonly status: string;
  readonly bedrooms: string;
  readonly areaFrom: string;
  readonly priceFrom: string;
  readonly video?: string;
  readonly imagen?: string;
}

@Component({
  imports: [HlmCarouselImports, NgIcon],
  providers: [provideIcons({ lucideBedDouble, lucideRuler })],
  selector: 'app-main-banner',
  styleUrl: './main-banner.component.css',
  templateUrl: './main-banner.component.html',
})
export class MainBannerComponent {
  carousel = viewChild.required(HlmCarousel);



  slideContents = viewChildren<ElementRef>('slideContent');
  titulos = viewChildren<ElementRef>('titulo');
  subtitulos = viewChildren<ElementRef>('subtitulo');
  descripciones = viewChildren<ElementRef>('descripcion');
  botones = viewChildren<ElementRef>('boton');

  protected readonly slides: readonly BannerSlide[] = [
    {
      eyebrow: 'Bienvenido a Montepinar',
      title: 'Un lugar para vivir a tu manera',
      description: 'Descubre un entorno tranquilo, cercano y lleno de vida para disfrutar cada día.',
      action: 'Conoce Montepinar',
      href: '#urbanizacion',
      theme: 'bg-gradient-to-br from-[#0b5d4b] via-[#118267] to-[#f28c2d]',
      status: 'En construcción',
      bedrooms: '1, 2 y 3',
      areaFrom: '90 m²',
      priceFrom: '189.000 €',
      video: '/video/montepinar-banner.mp4',
    },
    {
      eyebrow: 'Naturaleza y bienestar',
      title: 'Tu entorno, tu refugio',
      description: 'Espacios abiertos, aire libre y la calma que necesitas sin renunciar a estar conectado.',
      action: 'Explora nuestro entorno',
      href: '#servicios',
      theme: 'bg-gradient-to-br from-[#064b43] via-[#197b62] to-[#75a45a]',
      status: 'Próximamente',
      bedrooms: '1, 2 y 3',
      areaFrom: '75 m²',
      priceFrom: '169.000 €',
      imagen: '/images/slide2.webp',
    },
    {
      eyebrow: 'Una comunidad activa',
      title: 'Mucho más que una urbanización',
      description: 'Información, servicios y actualidad para sentirte parte de Montepinar.',
      action: 'Ver la actualidad',
      href: '#actualidad',
      theme: 'bg-gradient-to-br from-[#174951] via-[#126d65] to-[#dc8734]',
      status: 'En construcción',
      bedrooms: '1, 2 y 3',
      areaFrom: '80 m²',
      priceFrom: '179.000 €',
      imagen: '/images/slide3.webp',
    },
  ];



  constructor() {
    // Escucha el cambio de slide en Embla
    afterRenderEffect(() => {
      // Se re-ejecuta cada vez que cambia el slide del carrusel
      const index = this.carousel().currentSlide();
      this.animateSlide(index);
      this.zoomImages(index);
    });
  }

  private animateSlide(index: number) {
    const all = [
      ...this.subtitulos(),
      ...this.titulos(),
      ...this.descripciones(),
      ...this.botones(),
    ].map((r) => r.nativeElement);

    const targets = [
      this.subtitulos()[index],
      this.titulos()[index],
      this.descripciones()[index],
      this.botones()[index],
    ]
      .filter(Boolean)
      .map((r) => r.nativeElement);

    if (!targets.length) return;

    gsap.killTweensOf(all);
    // Oculta el contenido de los slides inactivos
    gsap.set(all.filter((el) => !targets.includes(el)), { opacity: 0 });

    gsap.fromTo(
      targets,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.18, ease: 'power3.out' }
    );
  }

  private zoomImages(index: number) {

    this.slideContents().forEach((slide, i) => {
      const img = slide.nativeElement.querySelector('img[data-zoom]');
      if (!img) return;

      gsap.killTweensOf(img);
      if (i !== index) return;
      gsap.fromTo(
        img,
        { scale: 1 },
        { scale: 1.2, duration: 10, ease: 'none' }
      );
    });
  }




}
