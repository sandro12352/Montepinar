import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
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

  /** Paso que ocupa el centro de la pantalla en escritorio. */
  protected readonly active = signal(0);

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
      const mm = gsap.matchMedia(root);

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-head]',
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '[data-heading]', start: 'top 82%', once: true } },
        );
      });

      // Escritorio: la imagen fija cambia con cada paso y una línea se rellena con el avance.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const frames = gsap.utils.toArray<HTMLElement>('[data-frame]', root);
        gsap.set(frames.slice(1), { autoAlpha: 0, scale: 1.08 });

        gsap.fromTo('[data-fill]', { scaleY: 0 }, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '[data-steps]', start: 'top 55%', end: 'bottom 55%', scrub: true },
        });

        root.querySelectorAll<HTMLElement>('[data-step]').forEach((step, index) => {
          ScrollTrigger.create({
            trigger: step,
            start: 'top 55%',
            end: 'bottom 55%',
            onToggle: (self) => {
              if (!self.isActive) return;
              this.active.set(index);
              frames.forEach((frame, i) => {
                gsap.to(frame, { autoAlpha: i === index ? 1 : 0, scale: i === index ? 1 : 1.08, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
              });
            },
          });

          gsap.fromTo(step.querySelectorAll('[data-step-item]'), { autoAlpha: 0, y: 30 }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: step, start: 'top 80%', once: true },
          });
        });
      });

      // Móvil: cada paso trae su imagen y entra al hacer scroll.
      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        root.querySelectorAll<HTMLElement>('[data-step]').forEach((step) => {
          gsap.fromTo(step.querySelectorAll('[data-step-item]'), { autoAlpha: 0, y: 26 }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: step, start: 'top 82%', once: true },
          });
        });
      });

      this.destroyRef.onDestroy(() => mm.revert());
    });
  }
}
