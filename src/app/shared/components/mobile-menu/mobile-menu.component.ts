import { Overlay } from '@angular/cdk/overlay';
import { Component, DestroyRef, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideArrowUpRight, lucideCalendarDays } from '@ng-icons/lucide';
import { BrnSheet } from '@spartan-ng/brain/sheet';
import { HlmAccordionImports } from '@spartan-ng/helm/accordion';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { MobileMenuService } from '../../../core/services/mobile-menu.service';
import { VisitSheetService } from '../../../core/services/visit-sheet.service';
import { NAVIGATION_ITEMS } from '../header/navigation.data';
import { SocialLinksComponent } from '../social-links/social-links.component';

/** Duración de la salida del sheet; el bloqueo de scroll se libera al terminar. */
const SHEET_CLOSE_MS = 350;

@Component({
  imports: [HlmAccordionImports, HlmSheetImports, NgIcon, RouterLink, RouterLinkActive, SocialLinksComponent],
  providers: [provideIcons({ lucideArrowRight, lucideArrowUpRight, lucideCalendarDays })],
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
})
export class MobileMenuComponent {
  private readonly visitSheet = inject(VisitSheetService);
  private readonly sheet = viewChild.required(BrnSheet);

  protected readonly items = NAVIGATION_ITEMS;
  /** La página de atrás no debe desplazarse mientras el menú está abierto. */
  protected readonly blockScroll = inject(Overlay).scrollStrategies.block();

  /** Cierra el sheet por un enlace: la página nueva se posiciona cuando el bloqueo de scroll ya se liberó. */
  private navigating = false;

  constructor() {
    inject(Router).events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        if (!this.navigating) return;
        this.navigating = false;
        const fragment = event.urlAfterRedirects.split('#')[1];
        setTimeout(() => {
          const target = fragment ? document.getElementById(fragment) : null;
          if (target) target.scrollIntoView();
          else window.scrollTo(0, 0);
        }, SHEET_CLOSE_MS);
      });
    const unregister = inject(MobileMenuService).register(() => this.open());
    inject(DestroyRef).onDestroy(unregister);
  }

  open(): void {
    this.sheet().open();
  }

  protected close(): void {
    this.sheet().close();
  }

  /** Click en un enlace de navegación. */
  protected onNavigate(): void {
    this.navigating = true;
    this.close();
  }

  /** Cierra el menú y abre la visita cuando el panel ya terminó de salir, para no solapar dos sheets. */
  protected openVisit(): void {
    this.close();
    setTimeout(() => this.visitSheet.open(), 250);
  }
}
