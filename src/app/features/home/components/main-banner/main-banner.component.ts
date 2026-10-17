import {
  afterNextRender,
  afterRenderEffect,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMapPinHouse, lucideArrowRight } from '@ng-icons/lucide';
import { HlmCarousel, HlmCarouselImports } from '@spartan-ng/helm/carousel';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoaderService } from '../../../../core/services/loader.service';
import Autoplay from 'embla-carousel-autoplay'

gsap.registerPlugin(ScrollTrigger);

interface BannerSlide {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly action: string;
  readonly href: string;
  readonly video?: string;
  readonly imagen?: string;
}

@Component({
  imports: [HlmCarouselImports, NgIcon],
  providers: [provideIcons({ lucideMapPinHouse,lucideArrowRight })],
  selector: 'app-main-banner',
  styleUrl: './main-banner.component.css',
  templateUrl: './main-banner.component.html',
})
export class MainBannerComponent {
  carousel = viewChild.required(HlmCarousel);
  private readonly loaderService = inject(LoaderService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly bannerRoot = viewChild.required<ElementRef<HTMLElement>>('bannerRoot');
  protected readonly activeSlide = signal(0);



  protected goToSlide(index: number): void {
    this.carousel().scrollTo(index);
  }



  slideContents = viewChildren<ElementRef>('slideContent');
  titulos = viewChildren<ElementRef>('titulo');
  subtitulos = viewChildren<ElementRef>('subtitulo');
  descripciones = viewChildren<ElementRef>('descripcion');
  botones = viewChildren<ElementRef>('boton');
  card = viewChildren<ElementRef>('cardFloat');
  

  protected readonly slides: readonly BannerSlide[] = [
    {
      eyebrow: 'Bienvenido a Montepinar',
      title: 'Un lugar para vivir a tu manera',
      description: 'Descubre un entorno tranquilo, cercano y lleno de vida para disfrutar cada día.',
      action: 'Ver proyectos',
      href: '#proyectos',
      imagen:'/images/prueba1.png'
    },
    {
      eyebrow: 'Naturaleza y bienestar',
      title: 'Tu entorno, tu refugio',
      description: 'Espacios abiertos, aire libre y la calma que necesitas sin renunciar a estar conectado.',
      action: 'Ver recorrido virtual',
      href: '#vision-360',
      imagen: '/images/slide2.webp',
    },
    {
      eyebrow: 'Una comunidad activa',
      title: 'Mucho más que una urbanización',
      description: 'Descubre las experiencias que forman parte de la comunidad Montepinar.',
      action: 'Ver testimonios',
      href: '#testimonios',
      imagen: '/images/slide3.webp',
    },
  ];

  readonly carrouselPlugins = [Autoplay({
    delay: 8000,
    stopOnInteraction: false,
  })]



  constructor() {
    afterNextRender(() => {
      const root = this.bannerRoot().nativeElement;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const context = gsap.context(() => {
        gsap.to(root.querySelectorAll<HTMLElement>('[data-banner-media]'), {
          yPercent: -5,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        gsap.to([
          ...root.querySelectorAll<HTMLElement>('[data-banner-copy]'),
          ...root.querySelectorAll<HTMLElement>('[data-card-float]'),
        ], {
          x: -120,
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });

    // Escucha el cambio de slide en Embla
    afterRenderEffect(() => {
      if (!this.loaderService.ready()) return; // 👈 espera al loader
      const index = this.carousel().currentSlide();
      this.activeSlide.set(index);

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
      ...this.card(),
    ].map((r) => r.nativeElement);

    const targets = [
      this.subtitulos()[index],
      this.titulos()[index],
      this.descripciones()[index],
      this.botones()[index],
      this.card()[0],
    ]
      .filter(Boolean)
      .map((r) => r.nativeElement);

    if (!targets.length) return;

    gsap.killTweensOf(all);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(all, { clearProps: 'opacity,visibility,transform' });
      return;
    }

    gsap.fromTo(
      targets,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.8, stagger: 0.18, ease: 'power1.inOut' }
    );
  }

  private zoomImages(index: number) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.slideContents().forEach((slide, i) => {
      const img = slide.nativeElement.querySelector('img[data-zoom]');
      if (!img) return;

      gsap.killTweensOf(img);
      if (reduceMotion) {
        gsap.set(img, { scale: 1 });
        return;
      }
      if (i !== index) return;
      gsap.fromTo(
        img,
        { scale: 1 },
        { scale: 1.2, duration: 12, ease: 'none' }
      );
    });
  }




}
