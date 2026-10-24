import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ProcessStep {
  readonly number: string;
  readonly title: string;
  readonly text: string;
  readonly image: string;
  readonly imageAlt: string;
}

@Component({
  selector: 'app-about-process',
  templateUrl: './about-process.component.html',
})
export class AboutProcessComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly steps: readonly ProcessStep[] = [
    {
      number: '01',
      title: 'Conoce el proyecto',
      text: 'Visítanos o recorre el proyecto en 360° y descubre las zonas disponibles.',
      image: '/images/entrada.png',
      imageAlt: 'Entrada y áreas verdes de Montepinar',
    },
    {
      number: '02',
      title: 'Elige tu lote',
      text: 'Te ayudamos a encontrar el tamaño y la ubicación que mejor se ajustan a ti.',
      image: '/images/mapa.png',
      imageAlt: 'Mapa de ubicación del proyecto Montepinar',
    },
    {
      number: '03',
      title: 'Compara y decide',
      text: 'Revisamos contigo las opciones de financiamiento y las condiciones de compra.',
      image: '/images/presentacion.webp',
      imageAlt: 'Familias revisan el plano del proyecto con el equipo',
    },
    {
      number: '04',
      title: 'Separa con acompañamiento',
      text: 'Un asesor te guía en la separación y en toda la documentación legal.',
      image: '/images/slide3.webp',
      imageAlt: 'Asesor acompaña a visitantes durante el recorrido',
    },
    {
      number: '05',
      title: 'Construye tu hogar',
      text: 'Recibe tu lote y empieza a levantar el lugar donde vivirás con tranquilidad.',
      image: '/images/slide2.webp',
      imageAlt: 'Áreas recreativas y deportivas de Montepinar',
    },
  ];

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        gsap.fromTo('[data-reveal]',
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: root.querySelector('[data-text]'), start: 'top 78%', once: true },
          },
        );

        // Cada paso entra al llegar a pantalla: la imagen desde su lado y el texto escalonado.
        root.querySelectorAll<HTMLElement>('[data-step]').forEach((step, index) => {
          const trigger = { trigger: step, start: 'top 80%', once: true };

          gsap.fromTo(step.querySelector('[data-step-image]'),
            { autoAlpha: 0, x: index % 2 === 0 ? 88 : -88 },
            { autoAlpha: 1, x: 0, duration: 0.95, ease: 'power1.inOut', scrollTrigger: trigger },
          );

          gsap.fromTo(step.querySelectorAll('[data-step-text] > *'),
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.1, ease: 'power2.out', scrollTrigger: trigger },
          );
        });
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
