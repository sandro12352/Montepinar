import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideHouse, lucideMessageCircle, lucideTrees, lucideTrendingUp } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { whatsappLink } from '../../../contact/data/contact.data';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon, RouterLink],
  providers: [provideIcons({ lucideArrowRight, lucideHouse, lucideMessageCircle, lucideTrees, lucideTrendingUp })],
  selector: 'app-resident-help',
  templateUrl: './resident-help.component.html',
})
export class ResidentHelpComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly whatsapp = whatsappLink('Hola, quisiera asesoría para elegir mi terreno en Montepinar.');

  protected readonly options = [
    { icon: 'lucideHouse', label: 'Lotes residenciales' },
    { icon: 'lucideTrees', label: 'Lotes campestres' },
    { icon: 'lucideTrendingUp', label: 'Inversión' },
  ];

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const mm = gsap.matchMedia(root);

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const trigger = { trigger: root, start: 'top 72%', once: true };

        gsap.fromTo('[data-line]', { yPercent: 115 }, { yPercent: 0, duration: 1, stagger: 0.12, ease: 'power4.out', scrollTrigger: trigger });
        gsap.fromTo('[data-fade]', { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12, delay: 0.35, ease: 'power3.out', scrollTrigger: trigger });
        gsap.fromTo('[data-option]', { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.7, stagger: 0.1, delay: 0.7, ease: 'power3.out', scrollTrigger: trigger });
        gsap.fromTo('[data-art]', { autoAlpha: 0, y: 70, scale: 0.92 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.3, ease: 'power4.out', scrollTrigger: trigger });

        // La ilustración flota despacio, el halo respira y el botón late para invitar al clic.
        gsap.to('[data-art]', { y: -12, duration: 3.2, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.6 });
        gsap.to('[data-orb]', { scale: 1.12, duration: 4.5, ease: 'sine.inOut', repeat: -1, yoyo: true });
        gsap.to('[data-pulse]', { scale: 1.9, autoAlpha: 0, duration: 1.8, ease: 'power2.out', repeat: -1, repeatDelay: 0.6 });

        // Paralaje: el halo se mueve más lento que la ilustración al hacer scroll.
        gsap.fromTo('[data-orb]', { yPercent: -10 }, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true } });
      });

      this.destroyRef.onDestroy(() => mm.revert());
    });
  }
}
