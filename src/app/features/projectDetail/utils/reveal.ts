import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Revela con scroll los elementos `[data-reveal]` de un bloque. Llamar dentro de un gsap.context. */
export function revealOnScroll(root: HTMLElement, selector = '[data-reveal]'): void {
  const items = Array.from(root.querySelectorAll<HTMLElement>(selector));
  if (!items.length) return;

  gsap.fromTo(
    items,
    { autoAlpha: 0, y: 28 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.09,
      ease: 'power3.out',
      scrollTrigger: { trigger: root, start: 'top 78%', once: true },
    },
  );
}

export const prefersReducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const formatSoles = (value: number): string => `S/ ${Math.round(value).toLocaleString('en-US')}`;
