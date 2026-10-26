import { afterNextRender, afterRenderEffect, Component, DestroyRef, ElementRef, inject, Injector, signal, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { VisitSheetComponent } from '../visit-sheet/visit-sheet.component';
import { LoaderService } from '../../../core/services/loader.service';

interface NavigationItem {
  readonly label: string;
  // Ruta de página (se marca como activa) o ancla de la home.
  readonly path?: string;
  readonly anchor?: string;
}

@Component({
  imports: [NgIcon, RouterLink, RouterLinkActive, VisitSheetComponent],
  providers: [provideIcons({ lucideArrowRight })],
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);
  private visitSheet = viewChild(VisitSheetComponent);

  // Cambia estas rutas para elegir el logo de cada estado del header.
  protected readonly transparentHeaderLogoSrc = '/images/LogotipoBlanco.png';
  protected readonly whiteHeaderLogoSrc = '/images/logo.webp';

  private readonly injector = inject(Injector);
  private readonly loaderService = inject(LoaderService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly header = viewChild.required<ElementRef<HTMLElement>>('header');
  private readonly nav = viewChild.required<ElementRef<HTMLElement>>('nav');

  protected readonly navigationItems: readonly NavigationItem[] = [
    { label: 'Inicio', path: '/' },
    { label: 'Nosotros', path: '/about' },
    { label: 'Proyectos', path: '/projects' },
    { label: 'Visita guiada', path: '/visita-guiada' },
    { label: 'Visión 360°', anchor: '/#vision-360' },
    { label: 'Testimonios', anchor: '/#testimonios' },
  ];

  constructor() {
    afterRenderEffect(() => {
      if (!this.loaderService.ready()) return;

      const header = this.header().nativeElement;
      const context = gsap.context(() => {
        gsap.set(header, { visibility: 'visible' });
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        gsap.fromTo(
          ['[data-anim="logo"]', '[data-anim="link"]', '[data-anim="cta"]'],
          { autoAlpha: 0, y: -12 },
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', clearProps: 'transform,opacity,visibility' },
        );
      }, header);

      let wasScrolled = false;
      const updateHeader = () => {
        const isScrolled = window.scrollY > 80;
        if (isScrolled === wasScrolled) return;
        wasScrolled = isScrolled;
        this.scrolled.set(isScrolled);

        if (isScrolled) {
          gsap.set(header, { position: 'fixed', top: 0, left: 0, right: 0, yPercent: -100 });
          gsap.to(header, { yPercent: 0, duration: 0.45, ease: 'power3.out', overwrite: true });
        } else {
          gsap.to(header, {
            yPercent: -100,
            duration: 0.25,
            ease: 'power2.in',
            overwrite: true,
            onComplete: () => {
              if (wasScrolled) return;
              gsap.set(header, { position: 'absolute', clearProps: 'top,left,right,transform' });
              this.scrolled.set(false);
            },
          });
        }
      };

      updateHeader();
      window.addEventListener('scroll', updateHeader, { passive: true });
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', updateHeader);
        context.revert();
      });
    });
  }

  protected toggleMenu(): void {
    this.menuOpen() ? this.closeMenu() : this.openMenu();
  }

  protected closeMenu(): void {
    if (!this.menuOpen()) return;
    const nav = this.nav().nativeElement;
    if (!window.matchMedia('(max-width: 767px)').matches) {
      this.menuOpen.set(false);
      return;
    }

    gsap.to(nav, {
      autoAlpha: 0,
      y: -8,
      duration: 0.18,
      ease: 'power2.in',
      onComplete: () => {
        this.menuOpen.set(false);
        gsap.set(nav, { clearProps: 'opacity,visibility,transform' });
      },
    });
  }


  protected openVisitSheet(): void {
    this.closeMenu();

    this.visitSheet()?.openSheet();
  }

  private openMenu(): void {
    this.menuOpen.set(true);
    if (!window.matchMedia('(max-width: 767px)').matches) return;

    afterNextRender(() => {
      const nav = this.nav().nativeElement;
      gsap.fromTo(nav, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.24, ease: 'power2.out' });
    }, { injector: this.injector });
  }
}
