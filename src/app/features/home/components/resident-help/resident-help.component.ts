import { afterNextRender, Component, ElementRef, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [],
  selector: 'app-resident-help',
  styleUrl: './resident-help.component.css',
  templateUrl: './resident-help.component.html',
})
export class ResidentHelpComponent {
  private readonly section = viewChild<ElementRef<HTMLElement>>('residentHelp');
  private readonly image = viewChild<ElementRef<HTMLImageElement>>('residentImage');
  private readonly copy = viewChild<ElementRef<HTMLElement>>('residentCopy');

  constructor() {
    afterNextRender(() => {
      const section = this.section()?.nativeElement;
      const image = this.image()?.nativeElement;
      const copy = this.copy()?.nativeElement;
      if (!section || !image || !copy) return;

      const context = gsap.context(() => {
        const textElements = copy.querySelectorAll<HTMLElement>('[data-resident-text]');

        gsap.fromTo(image, { autoAlpha: 0, x: 70, scale: 1.06 }, {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 75%', once: true },
        });

        gsap.fromTo(textElements, { autoAlpha: 0, y: 32 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 75%', once: true },
        });
      }, section);

      return () => context.revert();
    });
  }
}
