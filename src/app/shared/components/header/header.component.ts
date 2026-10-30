import { afterRenderEffect, Component, computed, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideChevronDown, lucideChevronRight, lucideArrowUpRight } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { VisitSheetService } from '../../../core/services/visit-sheet.service';
import { VisitSheetComponent } from '../visit-sheet/visit-sheet.component';
import { LoaderService } from '../../../core/services/loader.service';
import { MobileMenuService } from '../../../core/services/mobile-menu.service';
import { MobileMenuComponent } from '../mobile-menu/mobile-menu.component';
import { NAVIGATION_ITEMS, NavigationAction } from './navigation.data';

@Component({
  imports: [NgIcon, NgTemplateOutlet, RouterLink, RouterLinkActive, VisitSheetComponent, MobileMenuComponent],
  providers: [provideIcons({ lucideArrowRight, lucideChevronDown, lucideChevronRight, lucideArrowUpRight })],
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  protected readonly scrolled = signal(false);
  protected readonly openDropdownLabel = signal<string | null>(null);
  /** El header se pinta blanco al hacer scroll o mientras hay un desplegable abierto. */
  protected readonly solid = computed(() => this.scrolled() || this.openDropdownLabel() !== null);
  private visitSheet = inject(VisitSheetService);

  // Cambia estas rutas para elegir el logo de cada estado del header.
  protected readonly transparentHeaderLogoSrc = '/images/LogotipoBlanco.png';
  protected readonly whiteHeaderLogoSrc = '/images/logo.webp';

  private readonly loaderService = inject(LoaderService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly cardClass =
    'group/card block w-full cursor-pointer rounded-3xl border-0 bg-transparent p-2 text-left text-[var(--brand-forest-900)] no-underline transition-colors duration-200 hover:bg-[var(--brand-forest-50)] focus-visible:bg-[var(--brand-forest-50)] focus-visible:outline-none';
  protected readonly footerClass =
    'group/foot inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-sm font-extrabold text-[var(--brand-forest-900)] no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2';

  private readonly header = viewChild.required<ElementRef<HTMLElement>>('header');
  private readonly mobileMenu = inject(MobileMenuService);

  protected readonly navigationItems = NAVIGATION_ITEMS;

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

  protected openDropdown(event: Event, label: string): void {
    const panel = this.dropdownPanel(event);
    if (!panel) return;
    // El foco al hacer mousedown en una opción dispararía de nuevo la animación y cancelaría el click.
    if (this.openDropdownLabel() === label) return;

    this.openDropdownLabel.set(label);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = panel.querySelectorAll('[data-dropdown-item]');

    gsap.killTweensOf([panel, items]);
    gsap.fromTo(
      panel,
      { autoAlpha: 0, y: 14, scale: 0.97 },
      { autoAlpha: 1, y: 0, scale: 1, duration: reduced ? 0 : 0.32, ease: 'power3.out', transformOrigin: 'top center' },
    );
    if (!reduced) {
      gsap.fromTo(items, { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.35, stagger: 0.06, delay: 0.08, ease: 'power2.out' });
    }
  }

  protected closeDropdown(event: Event, label: string): void {
    const panel = this.dropdownPanel(event);
    if (!panel) return;

    if (this.openDropdownLabel() === label) this.openDropdownLabel.set(null);
    gsap.killTweensOf(panel);
    gsap.to(panel, { autoAlpha: 0, y: 10, scale: 0.97, duration: 0.2, ease: 'power2.in' });
  }

  /** Cierra el desplegable solo cuando el foco sale por completo del grupo. */
  protected onDropdownFocusOut(event: FocusEvent, label: string): void {
    const host = event.currentTarget as HTMLElement;
    if (event.relatedTarget instanceof Node && host.contains(event.relatedTarget)) return;
    this.closeDropdown(event, label);
  }

  private dropdownPanel(event: Event): HTMLElement | null {
    const target = event.currentTarget as HTMLElement;
    // Desde el grupo del menú se busca hacia dentro; desde un enlace del panel, hacia fuera.
    return target.querySelector<HTMLElement>('[data-dropdown-panel]') ?? target.closest<HTMLElement>('[data-dropdown-panel]');
  }

  protected onChildClick(event: Event, child: NavigationAction, label: string): void {
    this.closeDropdown(event, label);
    if (child.action === 'visit') this.openVisitSheet();
  }

  protected openVisitSheet(): void {
    this.visitSheet.open();
  }

  protected openMenu(): void {
    this.mobileMenu.open();
  }
}
