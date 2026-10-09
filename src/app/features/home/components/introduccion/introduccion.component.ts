import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
@Component({
  imports: [NgIcon],
  providers: [provideIcons({ lucideArrowRight })],
  selector: 'app-introduccion',
  styleUrl: './introduccion.component.css',
  templateUrl: './introduccion.component.html',
})
export class IntroduccionComponent {

  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  // Reemplaza con tus datos reales
  stats = [
    { value: 10, prefix: '+', suffix: '', label: 'Años de trayectoria' },
    { value: 1200, prefix: '+', suffix: '', label: 'Familias felices' },
    { value: 15, prefix: '', suffix: '', label: 'Proyectos entregados' },
    { value: 98, prefix: '', suffix: '%', label: 'Clientes satisfechos' },
  ];

  constructor() {
    afterNextRender(() => {

      const ctx = gsap.context(() => {
        // Contadores: siempre se muestran, con o sin animación
        gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
          const end = Number(el.dataset['count']);
          const format = (v: number) => Math.round(v).toLocaleString('es-PE');


          const counter = { v: 0 };
          el.textContent = '0';

          gsap.to(counter, {
            v: end,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            onUpdate: () => (el.textContent = format(counter.v)),
          });
        });


        // Entrada escalonada del texto
        gsap.from('[data-reveal]', {
          opacity: 0,
          y: 40,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-text]', start: 'top 75%', once: true },
        });

        // Imágenes: entrada
        gsap.from('[data-img]', {
          opacity: 0,
          x: 60,
          duration: 1,
          stagger: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-images]', start: 'top 75%', once: true },
        });

        // Parallax suave (cada imagen se mueve a distinta velocidad)
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
          gsap.to(el, {
            yPercent: Number(el.dataset['parallax']),
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-images]',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        });

        // Franja de cifras
        gsap.from('[data-stat]', {
          opacity: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-stats]', start: 'top 88%', once: true },
        });
      }, this.root().nativeElement);

      this.destroyRef.onDestroy(() => ctx.revert());
    });
  }
}
