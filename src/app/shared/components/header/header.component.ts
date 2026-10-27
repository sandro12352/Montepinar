import { afterNextRender, afterRenderEffect, Component, DestroyRef, ElementRef, inject, Injector, signal, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideChevronDown, lucideChevronRight, lucideArrowUpRight } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { VisitSheetService } from '../../../core/services/visit-sheet.service';
import { VisitSheetComponent } from '../visit-sheet/visit-sheet.component';
import { LoaderService } from '../../../core/services/loader.service';
import { PROJECTS } from '../../../features/projects/data/projects.data';

interface NavigationAction {
  readonly label: string;
  readonly path?: string;
  readonly anchor?: string;
  // Acción en lugar de navegación (abre el sheet de visita).
  readonly action?: 'visit';
}

interface NavigationChild extends NavigationAction {
  readonly description: string;
  // Imagen que se muestra en la vista previa al pasar sobre la opción.
  readonly image: string;
}

interface NavigationItem {
  readonly label: string;
  // Ruta de página (se marca como activa) o ancla de la home.
  readonly path?: string;
  readonly anchor?: string;
  // Desplegable: lista numerada con vista previa y un enlace al pie.
  readonly menu?: {
    readonly eyebrow: string;
    readonly links: readonly NavigationChild[];
    readonly footer: NavigationAction;
  };
}

@Component({
  imports: [NgIcon, NgTemplateOutlet, RouterLink, RouterLinkActive, VisitSheetComponent],
  providers: [provideIcons({ lucideArrowRight, lucideChevronDown, lucideChevronRight, lucideArrowUpRight })],
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly openDropdownLabel = signal<string | null>(null);
  private visitSheet = inject(VisitSheetService);

  // Cambia estas rutas para elegir el logo de cada estado del header.
  protected readonly transparentHeaderLogoSrc = '/images/LogotipoBlanco.png';
  protected readonly whiteHeaderLogoSrc = '/images/logo.webp';

  private readonly injector = inject(Injector);
  private readonly loaderService = inject(LoaderService);
  private readonly destroyRef = inject(DestroyRef);
  /** Opción resaltada del desplegable abierto; define la imagen de la vista previa. */
  protected readonly previewIndex = signal(0);
  protected readonly rowClass =
    'group/row relative flex w-full cursor-pointer items-center gap-4 rounded-2xl border-0 bg-transparent px-3 py-3 text-left text-[var(--brand-forest-900)] no-underline transition-colors duration-200 focus-visible:outline-none motion-reduce:transition-none max-md:py-2';
  protected readonly footerClass =
    'group/foot inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-sm font-extrabold text-[var(--brand-forest-900)] no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2';

  private readonly header = viewChild.required<ElementRef<HTMLElement>>('header');
  private readonly nav = viewChild.required<ElementRef<HTMLElement>>('nav');

  protected readonly navigationItems: readonly NavigationItem[] = [
    { label: 'Nosotros', path: '/about' },
    { label: 'Equipo', anchor: '/about#equipo' },
    {
      label: 'Proyectos',
      path: '/projects',
      menu: {
        eyebrow: 'Nuestros proyectos',
        links: PROJECTS.map((project) => ({
          label: project.location,
          description: project.category,
          image: project.image,
          path: `/projects/${project.slug}`,
        })),
        footer: { label: 'Ver todos los proyectos', path: '/projects' },
      },
    },
    {
      label: 'Recorridos',
      menu: {
        eyebrow: 'Conoce Montepinar',
        links: [
          { label: 'Visita guiada', description: 'Recórrelo en persona con un asesor', image: '/images/entrada.png', action: 'visit' },
          { label: 'Visión 360°', description: 'Explóralo desde donde estés', image: '/images/slide2.webp', anchor: '/#vision-360' },
          { label: 'Galería', description: 'Cada rincón, en imágenes', image: '/images/slide3.webp', anchor: '/#galeria' },
        ],
        footer: { label: 'Preguntas frecuentes', anchor: '/#preguntas-frecuentes' },
      },
    },
    { label: 'Contacto', anchor: '/#contacto' },
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

  protected indexLabel(index: number): string {
    return String(index + 1).padStart(2, '0');
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


  protected openDropdown(event: Event, label: string): void {
    const panel = this.dropdownPanel(event);
    if (!panel || this.isMobile()) return;

    this.openDropdownLabel.set(label);
    this.previewIndex.set(0);
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
    if (!panel || this.isMobile()) return;

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

  private isMobile(): boolean {
    return window.matchMedia('(max-width: 767px)').matches;
  }

  protected onChildClick(event: Event, child: NavigationAction, label: string): void {
    this.closeDropdown(event, label);
    if (child.action === 'visit') this.openVisitSheet();
    else this.closeMenu();
  }

  protected openVisitSheet(): void {
    this.closeMenu();

    this.visitSheet.open();
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
