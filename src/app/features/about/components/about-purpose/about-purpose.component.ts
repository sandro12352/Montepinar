import { afterNextRender, afterRenderEffect, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCompass,
  lucideEye,
  lucideFileCheck,
  lucideHandshake,
  lucideHouse,
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
    provideIcons({ lucideCompass, lucideEye, lucideFileCheck, lucideHandshake, lucideHouse, lucideSprout, lucideTrees, lucideUsers }),
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
      image: '/images/slide3.webp',
      imageAlt: 'Visitantes recorren el proyecto Montepinar',
      eyebrow: 'Nuestra misión',
      title: 'Hacer que acceder a tu terreno sea simple, claro y confiable.',
      text: 'Acompañamos a cada familia con información transparente y planes a su medida, para que dar el paso hacia su lote sea una decisión tranquila y bien informada.',
      features: [
        { icon: 'lucideHandshake', title: 'Financiamiento directo', text: 'Planes a tu medida, sin bancos' },
        { icon: 'lucideFileCheck', title: 'Acompañamiento legal', text: 'Te guiamos en cada documento' },
        { icon: 'lucideEye', title: 'Transparencia total', text: 'Condiciones claras desde el inicio' },
        { icon: 'lucideTrees', title: 'Entornos verdes', text: 'Espacios para respirar y compartir' },
      ],
    },
    {
      image: '/images/MontepinarIquitos.webp',
      imageAlt: 'Atardecer sobre el proyecto Montepinar Iquitos',
      eyebrow: 'Nuestra visión',
      title: 'Construir comunidades en equilibrio con la naturaleza.',
      text: 'Soñamos con lugares donde cada generación pueda florecer, con vecinos que se conocen, un entorno que se cuida y hogares pensados para quedarse.',
      features: [
        { icon: 'lucideUsers', title: 'Comunidades activas', text: 'Vida en comunidad cada día' },
        { icon: 'lucideSprout', title: 'Naturaleza protegida', text: 'Desarrollos que respetan el paisaje' },
        { icon: 'lucideCompass', title: 'Decisiones informadas', text: 'Eliges con confianza y a tu ritmo' },
        { icon: 'lucideHouse', title: 'Hogares para generaciones', text: 'Lugares para quedarse y crecer' },
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
