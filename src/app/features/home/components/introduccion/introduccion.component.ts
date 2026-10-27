import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideCalendarDays, lucideCar, lucideScale, lucideShieldCheck, lucideWallet } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VisitSheetService } from '../../../../core/services/visit-sheet.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon, RouterLink],
  providers: [provideIcons({ lucideArrowRight, lucideCalendarDays, lucideCar, lucideScale, lucideShieldCheck, lucideWallet })],
  selector: 'app-introduccion',
  templateUrl: './introduccion.component.html',
})
export class IntroduccionComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly visitSheet = inject(VisitSheetService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly highlights = [
    { icon: 'lucideScale', title: 'Información legal', text: 'Documentación y permisos en regla.' },
    { icon: 'lucideShieldCheck', title: 'Seguridad 24/7', text: 'Vigilancia perimetral todo el año.' },
    { icon: 'lucideCar', title: 'Estacionamiento', text: 'Zonas sectorizadas para visitantes.' },
    { icon: 'lucideWallet', title: 'Facilidades de pago', text: 'Cancela tu terreno en cómodas cuotas.' },
  ];

  protected readonly stats = [
    { value: 10, prefix: '+', suffix: '', label: 'Años de trayectoria' },
    { value: 6000, prefix: '+', suffix: '', label: 'Familias felices' },
    { value: 15, prefix: '', suffix: '', label: 'Proyectos entregados' },
    { value: 98, prefix: '', suffix: '%', label: 'Clientes satisfechos' },
  ];

  protected openVisit(): void {
    this.visitSheet.open();
  }

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const once = (trigger: Element | string | null, start = 'top 80%') => ({ trigger, start, once: true });

        gsap.fromTo(
          '[data-reveal]',
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.09, ease: 'power3.out', scrollTrigger: once(root.querySelector('[data-text]')) },
        );

        gsap.fromTo(
          '[data-highlight]',
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out', scrollTrigger: once(root.querySelector('[data-highlights]'), 'top 88%') },
        );
        gsap.fromTo(
          '[data-line]',
          { scaleX: 0 },
          { scaleX: 1, duration: 1, stagger: 0.1, ease: 'power3.out', scrollTrigger: once(root.querySelector('[data-highlights]'), 'top 88%') },
        );

        // Collage: arco con revelado, imagen secundaria y tarjetas flotantes.
        const collage = root.querySelector('[data-collage]');
        const timeline = gsap.timeline({ scrollTrigger: once(collage, 'top 78%') });
        timeline
          .fromTo('[data-arch]', { clipPath: 'inset(100% 0% 0% 0% round 999px 999px 2rem 2rem)', autoAlpha: 0 }, { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 2rem 2rem)', autoAlpha: 1, duration: 1.3, ease: 'power4.out' })
          .fromTo('[data-arch-img]', { scale: 1.3 }, { scale: 1.08, duration: 1.8, ease: 'power3.out' }, 0)
          .fromTo('[data-small]', { autoAlpha: 0, y: 60, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' }, 0.45)
          .fromTo('[data-glass]', { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.8, ease: 'power3.out' }, 0.9)
          .fromTo('[data-badge]', { autoAlpha: 0, scale: 0.3, rotate: -40 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.9, ease: 'back.out(1.8)' }, 1);

        // Profundidad: la imagen del arco y la secundaria se mueven a distinto ritmo.
        gsap.fromTo('[data-arch-img]', { yPercent: -7 }, {
          yPercent: 7,
          ease: 'none',
          scrollTrigger: { trigger: collage, start: 'top bottom', end: 'bottom top', scrub: true },
        });
        gsap.to('[data-small]', {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: { trigger: collage, start: 'top bottom', end: 'bottom top', scrub: true },
        });

        // Movimiento suave continuo en las tarjetas y el sello.
        gsap.to('[data-glass]', { y: -8, duration: 3.2, ease: 'sine.inOut', repeat: -1, yoyo: true });
        gsap.to('[data-badge-ring]', { rotate: 360, duration: 18, ease: 'none', repeat: -1 });

        // Cifras
        const statsTrigger = once(root.querySelector('[data-stats]'), 'top 85%');
        root.querySelectorAll<HTMLElement>('[data-count]').forEach((counter) => {
          const value = { current: 0 };
          gsap.to(value, {
            current: Number(counter.dataset['count']),
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              counter.textContent = Math.round(value.current).toLocaleString('es-PE');
            },
            scrollTrigger: statsTrigger,
          });
        });

        gsap.fromTo(
          '[data-stat]',
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out', scrollTrigger: statsTrigger },
        );
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
