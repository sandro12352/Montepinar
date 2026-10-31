import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [],
  selector: 'app-faq',
  styleUrl: './faq.component.css',
  templateUrl: './faq.component.html',
})
export class FaqComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const header = root.querySelector<HTMLElement>('[data-faq-header]');
        const video = root.querySelector<HTMLElement>('[data-faq-video]');
        const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-faq-card]'));
        const cta = root.querySelector<HTMLElement>('[data-faq-cta]');

        if (header) {
          gsap.fromTo(header.children,
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: { trigger: header, start: 'top 82%', once: true },
            },
          );
        }

        if (video) {
          gsap.fromTo(video,
            { autoAlpha: 0, y: 24, scale: 0.975 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: 'power2.out',
              scrollTrigger: { trigger: video, start: 'top 84%', once: true },
            },
          );
        }

        // Las cards aparecen una por una, igual que la galería.
        if (cards.length) {
          gsap.fromTo(cards,
            { autoAlpha: 0, y: 24, scale: 0.975 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.1,
              stagger: 0.1,
              ease: 'power2.out',
              clearProps: 'transform',
              scrollTrigger: { trigger: cards[0], start: 'top 84%', once: true },
            },
          );
        }

        if (cta) {
          gsap.fromTo(cta.children,
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: 'power2.out',
              scrollTrigger: { trigger: cta, start: 'top 90%', once: true },
            },
          );
        }
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
