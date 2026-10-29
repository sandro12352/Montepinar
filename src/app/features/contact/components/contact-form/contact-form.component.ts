import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideSend } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { whatsappLink } from '../../data/contact.data';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon],
  providers: [provideIcons({ lucideCheck, lucideSend })],
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
})
export class ContactFormComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly sent = signal(false);

  // Borde sólido y siempre visible (sin variables ni transparencias), para que el campo se reconozca sin enfocarlo.
  protected readonly fieldClass =
    'min-h-13 w-full rounded-2xl border-2 border-[#6f8f7e] bg-[#fbfaf6] px-4 text-sm text-[var(--brand-forest-900)] outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-[var(--brand-forest-900)]/45 hover:border-[#03301A] focus:border-[#FB7A11] focus:bg-white focus:shadow-[0_0_0_4px_rgb(251_122_17/0.15)] motion-reduce:transition-none';

  protected submit(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement) || !form.reportValidity()) return;

    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    const note = String(data.get('message') ?? '').trim();

    const message = [
      `Hola, soy ${name} y quisiera información sobre Montepinar.`,
      `Correo: ${email}`,
      `Celular: ${phone}`,
      note ? `Mensaje: ${note}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
    this.sent.set(true);
  }

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const mm = gsap.matchMedia(root);

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const once = (trigger: string) => ({ trigger, start: 'top 80%', once: true });

        gsap.fromTo('[data-head]', { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: once('[data-heading]') });
        gsap.fromTo('[data-field]', { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out', scrollTrigger: once('[data-form]') });
      });

      this.destroyRef.onDestroy(() => mm.revert());
    });
  }
}
