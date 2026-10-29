import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideMail, lucideMapPin, lucidePhone } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONTACT_EMAIL, CONTACT_PHONES, OFFICE_ADDRESS, OFFICE_HOURS } from '../../data/contact.data';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon],
  providers: [provideIcons({ lucideArrowUpRight, lucideMail, lucideMapPin, lucidePhone })],
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
})
export class ContactInfoComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly address = OFFICE_ADDRESS;
  protected readonly email = CONTACT_EMAIL;
  protected readonly phones = CONTACT_PHONES;
  protected readonly hours = OFFICE_HOURS;
  protected readonly mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OFFICE_ADDRESS)}`;

  /** Fila de horario que corresponde a hoy; se calcula en el navegador para no desfasar la hidratación. */
  protected readonly today = signal<number | null>(null);

  constructor() {
    afterNextRender(() => {
      const day = new Date().getDay();
      this.today.set(day === 0 ? 2 : day === 6 ? 1 : 0);

      const root = this.root().nativeElement;
      const mm = gsap.matchMedia(root);

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const trigger = { trigger: '[data-grid]', start: 'top 82%', once: true };

        gsap.fromTo('[data-head]', { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '[data-heading]', start: 'top 85%', once: true } });
        gsap.fromTo('[data-col]', { autoAlpha: 0, y: 44 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.16, ease: 'power3.out', scrollTrigger: trigger });
        gsap.fromTo('[data-bar]', { scaleX: 0 }, { scaleX: 1, duration: 1.1, stagger: 0.16, ease: 'power3.inOut', scrollTrigger: trigger });
        gsap.fromTo('[data-icon]', { scale: 0, rotate: -45 }, { scale: 1, rotate: 0, duration: 0.8, stagger: 0.16, delay: 0.2, ease: 'back.out(1.8)', scrollTrigger: trigger });
      });

      this.destroyRef.onDestroy(() => mm.revert());
    });
  }
}
