import { afterNextRender, Component, DestroyRef, ElementRef, inject, Injector, signal, viewChild } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { gsap } from 'gsap';

interface NavigationItem {
  readonly label: string;
  readonly fragment: string;
}

@Component({
  imports: [HlmButtonImports],
  selector: 'app-header',
  styleUrl: './header.component.css',
  templateUrl: './header.component.html',
})
export class HeaderComponent {

  menuOpen = signal(false);
  scrolled = signal(false);

  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);

  private header = viewChild.required<ElementRef<HTMLElement>>('header');
  private bar = viewChild.required<ElementRef<HTMLElement>>('bar');
  private nav = viewChild.required<ElementRef<HTMLElement>>('nav');

  protected readonly navigationItems: readonly NavigationItem[] = [
    { label: 'Inicio', fragment: 'inicio' },
    { label: 'La urbanización', fragment: 'urbanizacion' },
    { label: 'Servicios', fragment: 'servicios' },
    { label: 'Actualidad', fragment: 'actualidad' },
  ];

  constructor() {
    afterNextRender(() => {
      const header = this.header().nativeElement;
      const bar = this.bar().nativeElement;

      // 1) Animación de entrada
      const ctx = gsap.context(() => {
        gsap
          .timeline({ defaults: { ease: 'power3.out', clearProps: 'transform,opacity' } })
          .from('[data-anim="bar"]', { opacity: 0, y: -20, duration: 0.6 })
          .from('[data-anim="logo"]', { opacity: 0, y: -20, duration: 0.7 }, '-=0.3')
          .from('[data-anim="link"]', { opacity: 0, y: -16, duration: 0.6, stagger: 0.08 }, '-=0.5')
          .from('[data-anim="cta"]', { opacity: 0, y: -16, scale: 0.95, duration: 0.6 }, '-=0.4');
      }, header);

    });

  }

  // 3) Menú móvil
  private isMobile() {
    return window.matchMedia('(max-width: 767px)').matches;
  }

  toggleMenu() {
    this.menuOpen() ? this.closeMenu() : this.openMenu();
  }

  private openMenu() {
    this.menuOpen.set(true);
    if (!this.isMobile()) return;

    afterNextRender(() => {
      const nav = this.nav().nativeElement;
      gsap.fromTo(nav, { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo(
        nav.querySelectorAll('a'),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, delay: 0.1, ease: 'power2.out', clearProps: 'transform,opacity' }
      );
    }, { injector: this.injector });
  }

  closeMenu() {
    if (!this.menuOpen()) return;

    if (!this.isMobile()) {
      this.menuOpen.set(false);
      return;
    }

    const nav = this.nav().nativeElement;
    gsap.to(nav, {
      autoAlpha: 0,
      y: -12,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        this.menuOpen.set(false);
        gsap.set(nav, { clearProps: 'all' });
      },
    });
  }

}
