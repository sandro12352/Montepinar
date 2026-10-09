import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  readonly name: string;
  readonly description: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly category: string;
  readonly priceFrom: string;
  readonly areaFrom: string;
  readonly bedrooms: string;
  readonly status: string;
}

@Component({
  imports: [],
  selector: 'app-proyects',
  styleUrl: './proyects.component.css',
  templateUrl: './proyects.component.html',
})
export class ProyectsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly projects: readonly Project[] = [
    {
      name: 'Proyecto Montepinar',
      description: 'Un desarrollo residencial pensado para construir un futuro a tu medida.',
      image: '/images/PalmerasdeMontepinar.png',
      imageAlt: 'Acceso principal a Montepinar',
      category: 'Desarrollo residencial',
      priceFrom: '189.000 €',
      areaFrom: '90 m²',
      bedrooms: '1, 2 y 3',
      status: 'En construcción',
    },
    {
      name: 'Espacios para disfrutar',
      description: 'Áreas recreativas y deportivas para compartir y disfrutar cada día.',
      image: '/images/AsociacionMontepinar.webp',
      imageAlt: 'Vista aérea de las áreas deportivas de Montepinar',
      category: 'Áreas comunes',
      priceFrom: '169.000 €',
      areaFrom: '75 m²',
      bedrooms: '1, 2 y 3',
      status: 'Próximamente',
    },
    {
      name: 'Una comunidad en crecimiento',
      description: 'Conoce los avances y el entorno que está dando vida a Montepinar.',
      image: '/images/MontepinarIquitos.webp',
      imageAlt: 'Recorrido de visitantes por el proyecto Montepinar',
      category: 'Comunidad',
      priceFrom: '179.000 €',
      areaFrom: '80 m²',
      bedrooms: '1, 2 y 3',
      status: 'En construcción',
    },
  ];

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        gsap.fromTo(
          '.project-card',
          { autoAlpha: 0, x: -120 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.85,
            stagger: 0.3,
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility',
            scrollTrigger: { trigger: root, start: 'top 50%', once: true },
          },
        );
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
