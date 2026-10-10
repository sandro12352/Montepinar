import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
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
  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');

  protected readonly projects: readonly Project[] = [
    {
      name: 'Proyecto Montepinar',
      location:"Chancay",
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
      location:"Huaral",
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
      location:"Iquitos",
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

        const stage = this.stage().nativeElement;
        const track = this.track().nativeElement;
        const slides = Array.from(root.querySelectorAll<HTMLElement>('.project-slide'));
        const panels = slides
          .map((slide) => slide.querySelector<HTMLElement>('.project-details'))
          .filter((panel): panel is HTMLElement => panel !== null);
        if (slides.length < 2 || panels.length !== slides.length) return;
        const infoItems = panels.map((panel) => Array.from(panel.querySelectorAll<HTMLElement>('[data-info-item]')));

        gsap.set(track, { width: `${slides.length * 100}%` });
        gsap.set(slides, { width: `${100 / slides.length}%`, flex: `0 0 ${100 / slides.length}%` });
        gsap.set(panels.slice(1), { autoAlpha: 0, x: 60 });
        gsap.set(infoItems.flat(), { autoAlpha: 0, x: -28 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: () => `+=${window.innerHeight * (slides.length - 1) * 0.85}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });


        for (let index = 0; index < slides.length - 1; index += 1) {
          const image = slides[index].querySelector<HTMLElement>('.project-image img');
          const incomingImage = slides[index + 1].querySelector<HTMLElement>('.project-image img');
          timeline.to(track, {
            x: () => -stage.clientWidth * (index + 1),
            duration: 1,
            ease: 'none',
          }, index);
          if (image) timeline.to(image, { scale: 1.06, duration: 1, ease: 'none' }, index);
          if (incomingImage) timeline.fromTo(incomingImage, { scale: 1 }, { scale: 1.06, duration: 0.8, ease: 'none' }, index + 0.2);
          timeline.to(panels[index], { autoAlpha: 0, x: -60, duration: 0.18, ease: 'power1.in' }, index + 0.02);
          timeline.fromTo(
            panels[index + 1],
            { autoAlpha: 0, x: 60 },
            { autoAlpha: 1, x: 0, duration: 0.3, ease: 'power2.out' },
            index + 0.06,
          );
          timeline.to(infoItems[index + 1], {
            autoAlpha: 1,
            x: 0,
            duration: 0.35,
            stagger: 0.08,
            ease: 'power2.out',
          }, index + 0.06);
        }
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
