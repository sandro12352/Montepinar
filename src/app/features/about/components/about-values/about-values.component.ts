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

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const heading = root.querySelector<HTMLElement>('[data-heading]');
        const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-card]'));

        if (heading) {
          gsap.fromTo(heading.children,
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: { trigger: heading, start: 'top 82%', once: true },
            },
          );
        }

        // Las tarjetas aparecen una por una, igual que la galería.
        if (cards.length) {
          gsap.fromTo(cards,
            { autoAlpha: 0, y: 24, scale: 0.975 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 1,
              stagger: 0.1,
              ease: 'power2.out',
              clearProps: 'transform',
              scrollTrigger: { trigger: cards[0], start: 'top 84%', once: true },
            },
          );
        }
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
