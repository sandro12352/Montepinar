import { afterNextRender, afterRenderEffect, Component, DestroyRef, ElementRef, inject, Injector, signal, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendarDays, lucideHouse, lucideMapPin, lucideTrees } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { gsap } from 'gsap';
import { LoaderService } from '../../../core/services/loader.service';

interface NavigationItem {
  readonly label: string;
  readonly fragment: string;
  readonly icon: string;
}

@Component({
  imports: [HlmButtonImports, NgIcon],
  providers: [provideIcons({ lucideCalendarDays, lucideHouse, lucideMapPin, lucideTrees })],
  selector: 'app-header',
  styleUrl: './header.component.css',
  templateUrl: './header.component.html',
})
export class HeaderComponent {

  menuOpen = signal(false);
  scrolled = signal(false);

  private readonly injector = inject(Injector);
  private readonly loaderService = inject(LoaderService);
  

  private readonly destroyRef = inject(DestroyRef);

  private header = viewChild.required<ElementRef<HTMLElement>>('header');
  private bar = viewChild.required<ElementRef<HTMLElement>>('bar');
  private nav = viewChild.required<ElementRef<HTMLElement>>('nav');

  protected readonly navigationItems: readonly NavigationItem[] = [
    { label: 'Ver proyectos', fragment: 'urbanizacion', icon: 'lucideHouse' },
    { label: 'La urbanización', fragment: 'urbanizacion', icon: 'lucideTrees' },
  ];

  constructor() {
    afterRenderEffect(() => {
      if (!this.loaderService.ready()) return; // 👈 espera al loader
      const header = this.header().nativeElement;
      const bar = this.bar().nativeElement;

      // Revela el header justo antes de crear el timeline (ver nota abajo)
    gsap.set(header, { visibility: 'visible' });

      const ctx = gsap.context(() => {
        gsap
          .timeline({ defaults: { ease: 'power3.out' }})
          .from(bar, {
            clipPath: 'inset(0 100% 0 0)',
            duration: 0.9,
            ease: 'power2.inOut',
            clearProps: 'clipPath',
          })
          .from('[data-anim="bar"]', {
            opacity: 0,
            y: 12,
            duration: 0.6,
            clearProps: 'transform,opacity',
          }, '-=0.3')
          .from('[data-anim="logo"]', {
            opacity: 0,
            y: -18,
            scale: 0.78,
            rotation: -7,
            transformOrigin: 'left center',
            duration: 1,
            ease: 'back.out(1.7)',
            clearProps: 'transform,opacity',
          }, '-=0.3')
          .from('[data-anim="link"]', {
            opacity: 0, y: -16, duration: 0.6, stagger: 0.08,
            clearProps: 'transform,opacity',
          }, '-=0.5')
          .from('[data-anim="cta"]', {
            opacity: 0, y: -16, scale: 0.95, duration: 0.6,
            clearProps: 'transform,opacity',
          }, '-=0.4');
      }, header);

      this.destroyRef.onDestroy(() => ctx.revert());
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
