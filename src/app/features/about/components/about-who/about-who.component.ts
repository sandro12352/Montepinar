import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-about-who',
  templateUrl: './about-who.component.html',
})
export class AboutWhoComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly points = [
    { title: '2018 · Nace la Inmobiliaria', text: 'Pedro Machuca ve la oportunidad de brindar más oportunidades a diferentes personas.' },
    { title: 'El éxito de la Asociación', text: 'La satisfacción de los compradores de la Asociación de Vivienda Montepinar abre nuevos horizontes.' },
    { title: 'Hoy', text: 'Terrenos en Chancayllo y en Iquitos, una de las mejores zonas selváticas del Perú.' },
  ];

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        gsap.fromTo(
          '[data-frame]',
          { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 2rem 2rem)', autoAlpha: 0 },
          {
            clipPath: 'inset(0% 0% 0% 0% round 999px 999px 2rem 2rem)',
            autoAlpha: 1,
            duration: 1.4,
            ease: 'power4.out',
            scrollTrigger: { trigger: '[data-frame]', start: 'top 82%', once: true },
          },
        );
        gsap.fromTo('[data-photo]', { yPercent: -7 }, {
          yPercent: 7,
          ease: 'none',
          scrollTrigger: { trigger: '[data-frame]', start: 'top bottom', end: 'bottom top', scrub: true },
        });
        gsap.fromTo(
          '[data-block]',
          { autoAlpha: 0, x: -40, rotate: -4 },
          { autoAlpha: 1, x: 0, rotate: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '[data-frame]', start: 'top 70%', once: true } },
        );
        gsap.fromTo(
          '[data-chip]',
          { autoAlpha: 0, scale: 0.6 },
          { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'back.out(1.8)', delay: 0.6, scrollTrigger: { trigger: '[data-frame]', start: 'top 70%', once: true } },
        );

        gsap.fromTo(
          '[data-reveal]',
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.09, ease: 'power3.out', scrollTrigger: { trigger: '[data-text]', start: 'top 78%', once: true } },
        );
        gsap.fromTo(
          '[data-line]',
          { scaleX: 0 },
          { scaleX: 1, duration: 1, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '[data-points]', start: 'top 88%', once: true } },
        );
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
