import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideCalendarDays, lucideCheck, lucideMessageCircle, lucidePhone } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { VisitSheetService } from '../../../../core/services/visit-sheet.service';
import { PROJECTS } from '../../../projects/data/projects.data';

gsap.registerPlugin(ScrollTrigger);

const WHATSAPP_NUMBER = '51932284185';

@Component({
  selector: 'app-contact-cta',
  templateUrl: './contact-cta.component.html',
  imports: [NgIcon],
  providers: [provideIcons({ lucideArrowRight, lucideCalendarDays, lucideCheck, lucideMessageCircle, lucidePhone })],
})
export class ContactCtaComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly visitSheet = inject(VisitSheetService);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly projects = PROJECTS.map((project) => ({ value: `Montepinar ${project.location}`, label: project.location }));
  protected readonly selectedProject = signal(this.projects[0].value);
  protected readonly phone = WHATSAPP_NUMBER;
  protected readonly avatars = [
    '/images/avatars/women-44.jpg',
    '/images/avatars/men-32.jpg',
    '/images/avatars/women-68.jpg',
  ];

  protected openVisit(): void {
    this.visitSheet.open();
  }

  protected requestInformation(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement) || !form.reportValidity()) return;

    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = [
      `Hola, soy ${name} y quisiera recibir información sobre Montepinar.`,
      `Proyecto de interés: ${this.selectedProject()}`,
      `Correo electrónico: ${email}`,
    ].join('\n');

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const mm = gsap.matchMedia(root);

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const panel = root.querySelector('[data-panel]');
        const media = root.querySelector('[data-media]');
        const image = root.querySelector('[data-media-img]');

        // Las tarjetas flotantes "respiran" con un vaivén lento una vez terminada la entrada.
        const float = gsap.to('[data-float]', { y: -8, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.8, paused: true });

        const timeline = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: panel, start: 'top 78%', once: true },
          onComplete: () => void float.play(),
        });

        timeline
          .fromTo(panel, { autoAlpha: 0, y: 48, scale: 0.98 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9 })
          .fromTo(
            media,
            { clipPath: 'inset(18% 14% 18% 14% round 2rem)' },
            { clipPath: 'inset(0% 0% 0% 0% round 1.5rem)', duration: 1.2, ease: 'power4.inOut' },
            0.15,
          )
          .fromTo(image, { scale: 1.25 }, { scale: 1.08, duration: 1.4, ease: 'power3.out' }, 0.15)
          .fromTo('[data-reveal]', { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.35)
          .fromTo('[data-field]', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.07 }, 0.6)
          .fromTo('[data-float]', { autoAlpha: 0, y: 24, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.6)', stagger: 0.12 }, 0.9);

        // Parallax suave de la imagen mientras la sección cruza la pantalla.
        gsap.fromTo(image, { yPercent: -5 }, {
          yPercent: 5,
          ease: 'none',
          scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true },
        });      });

      this.destroyRef.onDestroy(() => mm.revert());
    });
  }
}
