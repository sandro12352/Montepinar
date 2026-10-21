import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendarDays, lucideArrowRight, lucideFileText, lucideMapPin, lucideStar } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  readonly name: string;
  readonly location:string;
  readonly description: string;
  readonly image: string;
  readonly imageAlt: string;
  readonly category: string;
  readonly priceFrom: string;
  readonly status: string;
}

@Component({
  selector: 'app-proyects',
  templateUrl: './proyects.component.html',
  imports:[NgIcon],
  providers:[provideIcons({
      lucideCalendarDays,
      lucideArrowRight,
      lucideFileText,
      lucideMapPin,
      lucideStar,
    }),]
})
export class ProyectsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly projects: readonly Project[] = [
    {
      name: 'Proyecto Montepinar',
      location:"Chancay",
      description: 'Un desarrollo residencial pensado para construir un futuro a tu medida.',
      image: '/images/PalmerasdeMontepinar.png',
      imageAlt: 'Acceso principal a Montepinar',
      category: 'Desarrollo residencial',
      priceFrom: '189.000 €',
      status: 'En construcción',
    },
    {
      name: 'Espacios para disfrutar',
      location:"Huaral",
      description: 'Áreas recreativas y deportivas para compartir y disfrutar cada día.',
      image: '/images/AsociacionMontepinar.webp',
      imageAlt: 'Vista aérea de las áreas deportivas de Montepinar',
      category: 'Áreas comunes',
      priceFrom: '169.000 €',
      status: 'Próximamente',
    },
    {
      name: 'Una comunidad en crecimiento',
      location:"Iquitos",
      description: 'Conoce los avances y el entorno que está dando vida a Montepinar.',
      image: '/images/MontepinarIquitos.webp',
      imageAlt: 'Recorrido de visitantes por el proyecto Montepinar',
      category: 'Comunidad',
      priceFrom: '179.000 €',
      status: 'En construcción',
    },
  ];

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        root.querySelectorAll<HTMLElement>('[data-project-card]').forEach((card) => {
          gsap.from(card, {
            autoAlpha: 0,
            x: 36,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 82%',
              once: true,
            },
          });
        });

      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
