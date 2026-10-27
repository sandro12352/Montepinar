import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHandshake, lucideHardHat, lucideHeadset, lucideMegaphone, lucideScale } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TEAM_MEMBERS } from '../../data/team.data';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon],
  providers: [provideIcons({ lucideHandshake, lucideHardHat, lucideHeadset, lucideMegaphone, lucideScale })],
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
})
export class TeamMembersComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly members = TEAM_MEMBERS;

  /** Pasa a la siguiente foto con una apertura circular desde abajo. */
  private nextPhoto(figure: HTMLElement): void {
    const photos = Array.from(figure.querySelectorAll<HTMLElement>('[data-photo]'));
    if (photos.length < 2) return;

    const current = Number(figure.dataset['current'] ?? 0);
    const next = (current + 1) % photos.length;
    figure.dataset['current'] = String(next);

    gsap.killTweensOf(photos);
    gsap.set(photos[next], { zIndex: 2, autoAlpha: 1, scale: 1.12, clipPath: 'circle(0% at 50% 100%)' });
    gsap.set(photos[current], { zIndex: 1 });
    gsap.to(photos[next], { clipPath: 'circle(150% at 50% 100%)', scale: 1, duration: 1.9, ease: 'power3.inOut' });
    gsap.to(photos[current], {
      scale: 0.94,
      autoAlpha: 0.6,
      duration: 1.9,
      ease: 'power3.inOut',
      onComplete: () => {
        gsap.set(photos[current], { autoAlpha: 0, scale: 1, zIndex: 0 });
        gsap.set(photos[next], { clipPath: 'none' });
      },
    });
  }

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const mm = gsap.matchMedia(root);

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-head]',
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '[data-heading]', start: 'top 82%', once: true } },
        );

        // Cada integrante se revela como un arco que se abre, con retraso escalonado.
        gsap.fromTo(
          '[data-arch]',
          { autoAlpha: 0, yPercent: 12, clipPath: 'inset(100% 0% 0% 0% round 999px 999px 1rem 1rem)' },
          {
            autoAlpha: 1,
            yPercent: 0,
            clipPath: 'inset(0% 0% 0% 0% round 999px 999px 1rem 1rem)',
            duration: 1.1,
            stagger: 0.12,
            ease: 'power4.out',
            scrollTrigger: { trigger: '[data-members]', start: 'top 80%', once: true },
          },
        );
        gsap.fromTo(
          '[data-front]',
          { autoAlpha: 0, y: 60 },
          { autoAlpha: 1, y: 0, duration: 1, stagger: 0.12, delay: 0.25, ease: 'power3.out', scrollTrigger: { trigger: '[data-members]', start: 'top 80%', once: true } },
        );

        // Cambio automático de foto, escalonado entre integrantes; solo corre mientras la fila está a la vista.
        const loops = Array.from(root.querySelectorAll<HTMLElement>('[data-figure]'))
          .filter((figure) => figure.querySelectorAll('[data-photo]').length > 1)
          .map((figure, i) => {
            const call = gsap.delayedCall(3.5 + i * 1.2, () => {
              this.nextPhoto(figure);
              call.delay(6).restart(true);
            });
            call.pause();
            return call;
          });
        ScrollTrigger.create({
          trigger: '[data-members]',
          start: 'top 85%',
          end: 'bottom 10%',
          onToggle: (self) => loops.forEach((call) => call.paused(!self.isActive)),
        });

        gsap.fromTo(
          '[data-info]',
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.12, delay: 0.5, ease: 'power3.out', scrollTrigger: { trigger: '[data-members]', start: 'top 80%', once: true } },
        );
      });

      this.destroyRef.onDestroy(() => mm.revert());
    });
  }
}
