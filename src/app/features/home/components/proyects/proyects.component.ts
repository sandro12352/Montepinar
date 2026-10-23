import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCalendarDays,
  lucideDroplets,
  lucideHeadset,
  lucideMapPin,
  lucideRuler,
  lucideShieldCheck,
  lucideSprout,
  lucideSun,
  lucideTreePine,
  lucideTrophy,
  lucideUsers,
  lucideWaves,
  lucideZap,
} from '@ng-icons/lucide';
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
  readonly badge: string;
  readonly badgeTone: 'primary' | 'tertiary';
  readonly features: readonly { readonly icon: string; readonly label: string }[];
}

@Component({
  selector: 'app-proyects',
  templateUrl: './proyects.component.html',
  imports:[NgIcon],
  providers:[provideIcons({
      lucideCalendarDays,
      lucideDroplets,
      lucideHeadset,
      lucideMapPin,
      lucideRuler,
      lucideShieldCheck,
      lucideSprout,
      lucideSun,
      lucideTreePine,
      lucideTrophy,
      lucideUsers,
      lucideWaves,
      lucideZap,
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
      badge: 'Proyecto destacado',
      badgeTone: 'primary',
      features: [
        { icon: 'lucideRuler', label: '300 m² a 650 m²' },
        { icon: 'lucideUsers', label: 'Club Privado' },
        { icon: 'lucideShieldCheck', label: 'Seguridad 24/7' },
        { icon: 'lucideSprout', label: '40% Áreas Verdes' },
      ],
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
      badge: 'Fase de lanzamiento',
      badgeTone: 'tertiary',
      features: [
        { icon: 'lucideRuler', label: '350 m² a 800 m²' },
        { icon: 'lucideTrophy', label: 'Pádel & Tenis' },
        { icon: 'lucideDroplets', label: 'Riego tecnificado' },
        { icon: 'lucideSun', label: 'Sol todo el año' },
      ],
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
      badge: 'Eco-residencial',
      badgeTone: 'primary',
      features: [
        { icon: 'lucideRuler', label: '500 m² a 1,200 m²' },
        { icon: 'lucideWaves', label: 'Laguna privada' },
        { icon: 'lucideZap', label: 'Eco-energía' },
        { icon: 'lucideTreePine', label: 'Bosque protegido' },
      ],
    },
  ];

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        gsap.from('[data-reveal]', {
          autoAlpha: 0,
          y: 24,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: root.querySelector('[data-text]'),
            start: 'top 78%',
            once: true,
          },
        });

        root.querySelectorAll<HTMLElement>('[data-project-card]').forEach((card) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: 'top 82%',
              once: true,
            },
          });

          tl.from(card, {
            autoAlpha: 0,
            x: 100,
            duration: 0.9,
            ease: 'power3.out',
          }).from(
            card.querySelectorAll('li, a'),
            {
              autoAlpha: 0,
              y: 16,
              duration: 0.5,
              stagger: 0.07,
              ease: 'power2.out',
            },
            '-=0.5',
          );
        });

      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
