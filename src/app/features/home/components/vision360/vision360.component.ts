import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-vision360',
  styleUrl: './vision360.component.css',
  templateUrl: './vision360.component.html',
})
export class Vision360Component {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly isOpen = signal(false);
  protected readonly backgroundPosition = signal(50);

  private dragStartX = 0;
  private dragStartPosition = 50;

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const copy = Array.from(root.querySelectorAll<HTMLElement>('[data-vision-copy] > *'));
        const image = root.querySelector<HTMLElement>('[data-vision-image]');
        const playButton = root.querySelector<HTMLElement>('[data-vision-play]');
        const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-vision-step]'));
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top 72%',
            once: true,
          },
        });

        timeline.from(copy, {
          autoAlpha: 0,
          y: 30,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power3.out',
        });

        if (image) {
          timeline.from(image, {
            autoAlpha: 0,
            x: 110,
            y: 24,
            scale: 0.94,
            rotation: 1.5,
            duration: 0.9,
            ease: 'power3.out',
          }, '-=0.2');
        }

        if (playButton) {
          timeline.fromTo(playButton,
            { autoAlpha: 0, scale: 0.35, rotation: -70 },
            {
              autoAlpha: 1,
              scale: 1,
              rotation: 0,
              duration: 0.9,
              ease: 'elastic.out(1, 0.5)',
              clearProps: 'transform',
            },
            '-=0.35',
          );

          const hoverTween = gsap.to(playButton, {
            scale: 1.08,
            rotation: 3,
            duration: 0.28,
            ease: 'back.out(2)',
            paused: true,
          });
          const resetHover = () => hoverTween.reverse();
          const animateHover = () => hoverTween.play();
          playButton.addEventListener('pointerenter', animateHover);
          playButton.addEventListener('pointerleave', resetHover);
          playButton.addEventListener('focus', animateHover);
          playButton.addEventListener('blur', resetHover);
          this.destroyRef.onDestroy(() => {
            playButton.removeEventListener('pointerenter', animateHover);
            playButton.removeEventListener('pointerleave', resetHover);
            playButton.removeEventListener('focus', animateHover);
            playButton.removeEventListener('blur', resetHover);
          });
        }

        timeline.from(steps, {
          autoAlpha: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.14,
          ease: 'power2.out',
        }, '-=0.25');
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }

  protected openViewer(): void {
    this.backgroundPosition.set(50);
    this.isOpen.set(true);
  }

  protected closeViewer(): void {
    this.isOpen.set(false);
  }

  protected startDrag(event: PointerEvent): void {
    this.dragStartX = event.clientX;
    this.dragStartPosition = this.backgroundPosition();
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  protected moveDrag(event: PointerEvent): void {
    if (!(event.buttons & 1)) return;
    const delta = (event.clientX - this.dragStartX) / 8;
    this.backgroundPosition.set((this.dragStartPosition - delta + 100) % 100);
  }
}
