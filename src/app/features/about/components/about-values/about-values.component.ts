import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHandshake, lucideHeart, lucideLeaf, lucideShieldCheck } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon],
  providers: [provideIcons({ lucideHandshake, lucideHeart, lucideLeaf, lucideShieldCheck })],
  selector: 'app-about-values',
  templateUrl: './about-values.component.html',
})
export class AboutValuesComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly values = [
    { icon: 'lucideShieldCheck', title: 'Transparencia', text: 'Información clara y condiciones honestas, siempre.' },
    { icon: 'lucideHeart', title: 'Cercanía', text: 'Escuchamos a cada familia y la acompañamos de verdad.' },
    { icon: 'lucideLeaf', title: 'Naturaleza', text: 'Cuidamos el entorno que hace especial a cada proyecto.' },
    { icon: 'lucideHandshake', title: 'Compromiso', text: 'Cumplimos lo que prometemos, desde la visita hasta la entrega.' },
  ];

  /** Palabras que recorren la cinta; se repiten para que el movimiento no deje huecos. */
  protected readonly ribbon = Array.from({ length: 3 }, () => this.values.map((value) => value.title)).flat();

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        gsap.fromTo(
          '[data-head]',
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '[data-heading]', start: 'top 82%', once: true } },
        );

        // Las dos cintas viajan en sentidos opuestos al hacer scroll.
        gsap.fromTo('[data-ribbon="a"]', { xPercent: 0 }, { xPercent: -28, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
        gsap.fromTo('[data-ribbon="b"]', { xPercent: -28 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });

        gsap.fromTo(
          '[data-value]',
          { autoAlpha: 0, y: 32 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '[data-values]', start: 'top 82%', once: true } },
        );
        gsap.fromTo(
          '[data-line]',
          { scaleX: 0 },
          { scaleX: 1, duration: 1, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '[data-values]', start: 'top 82%', once: true } },
        );
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
