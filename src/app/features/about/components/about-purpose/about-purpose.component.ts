import { afterNextRender, afterRenderEffect, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCompass,
  lucideEye,
  lucideFileCheck,
  lucideHandshake,
  lucideHouse,
  lucideScale,
  lucideSprout,
  lucideTrees,
  lucideUsers,
} from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PurposeFeature {
  readonly icon: string;
  readonly title: string;
  readonly text: string;
}

interface PurposeSlide {
  readonly image: string;
  readonly imageAlt: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly text: string;
  readonly features: readonly PurposeFeature[];
}

@Component({
  imports: [NgIcon],
  providers: [
    provideIcons({ lucideCompass, lucideEye, lucideFileCheck, lucideHandshake, lucideHouse, lucideScale, lucideSprout, lucideTrees, lucideUsers }),
  ],
  selector: 'app-about-purpose',
  templateUrl: './about-purpose.component.html',
})
export class AboutPurposeComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  /** Panel abierto en escritorio. En pantallas pequeñas ambos se muestran completos. */
  protected readonly active = signal(0);

  protected readonly slides: readonly PurposeSlide[] = [
    {
      image: '/images/about/Familia contemplando el valle al atardecer.png',
      imageAlt: 'Una familia contempla el valle al atardecer',
      eyebrow: 'Nuestra misión',
      title: 'Un hogar con orgullo, a un costo justo.',
      text: 'Brindamos lugares de vivienda y entregamos terrenos que generan en nuestros clientes sentido de pertenencia, identificación y orgullo, a un costo justo y accesible para todos.',
      features: [
        { icon: 'lucideEye', title: 'Transparencia', text: 'Condiciones claras desde el inicio' },
        { icon: 'lucideScale', title: 'Ética', text: 'Actuamos con integridad en cada trato' },
      ],
    },
    {
      image: '/images/about/Familia contempla comunidad al amanecer.png',
      imageAlt: 'Una familia mira su comunidad al amanecer',
      eyebrow: 'Nuestra visión',
      title: 'La mejor inmobiliaria, con respeto por el planeta.',
      text: 'Queremos que Montepinar sea la mejor empresa inmobiliaria: la que ofrece a sus clientes una opción de vivienda digna y a sus colaboradores e inversionistas una exitosa oportunidad de desarrollo, reconocida además por su respeto al medio ambiente y la conservación del planeta.',
      features: [
        { icon: 'lucideHandshake', title: 'Honestidad', text: 'Decimos las cosas como son' },
        { icon: 'lucideUsers', title: 'Responsabilidad social', text: 'Crecemos junto a las personas' },
        { icon: 'lucideSprout', title: 'Responsabilidad ambiental', text: 'Cuidamos el entorno y el planeta' },
      ],
    },
  ];

  protected activate(index: number): void {
    this.active.set(index);
  }

  constructor() {
    // Escritorio: el panel elegido se abre y su contenido entra escalonado.
    afterRenderEffect(() => {
      const index = this.active();
      const root = this.root().nativeElement;
      const desktop = window.matchMedia('(min-width: 1024px)').matches;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!desktop) return;

      const panels = root.querySelectorAll<HTMLElement>('[data-panel]');
      gsap.to(panels, { flexGrow: (i: number) => (i === index ? 1.9 : 1), duration: reduced ? 0 : 0.9, ease: 'power3.inOut', overwrite: 'auto' });

      const details = panels[index]?.querySelectorAll('[data-detail]');
      if (details && !reduced) {
        gsap.fromTo(details, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.07, delay: 0.25, ease: 'power3.out', overwrite: 'auto' });
      }
    });

    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        gsap.fromTo(
          '[data-head]',
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '[data-heading]', start: 'top 82%', once: true } },
        );
        gsap.fromTo(
          '[data-panel]',
          { autoAlpha: 0, y: 60, clipPath: 'inset(8% 6% 8% 6% round 2.5rem)' },
          {
            autoAlpha: 1,
            y: 0,
            clipPath: 'inset(0% 0% 0% 0% round 2rem)',
            duration: 1.1,
            stagger: 0.18,
            ease: 'power4.out',
            scrollTrigger: { trigger: '[data-panels]', start: 'top 82%', once: true },
          },
        );
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
