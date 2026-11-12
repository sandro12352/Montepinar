import { afterNextRender, Component, inject, signal } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoaderService } from './core/services/loader.service';
import { organizationJsonLd } from './core/seo/structured-data';
import { RouteSeo, SeoService } from './core/services/seo.service';
import { AnniversaryConfettiComponent } from './shared/components/anniversary-confetti/anniversary-confetti.component';

@Component({
  imports: [RouterOutlet, AnniversaryConfettiComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private loader = inject(LoaderService);
  private router = inject(Router);
  private seo = inject(SeoService);
  protected readonly title = signal('Montepinar');

  constructor() {
    // Ficha de la empresa: igual en todas las páginas.
    this.seo.setJsonLd('organization', organizationJsonLd());

    // SEO por ruta: corre también en el servidor (prerender), por eso va fuera de afterNextRender.
    // Las rutas sin `data.seo` (p. ej. el detalle de proyecto) lo fijan en su propio componente.
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) return;
      let route: ActivatedRouteSnapshot = this.router.routerState.snapshot.root;
      while (route.firstChild) route = route.firstChild;
      const seo = route.data['seo'] as RouteSeo | undefined;
      if (!seo) return;
      this.seo.set({ ...seo, path: event.urlAfterRedirects.split(/[?#]/)[0] || '/' });
      // Las fichas de proyecto solo existen en el detalle de cada proyecto.
      this.seo.removeJsonLd('project');
      this.seo.removeJsonLd('breadcrumb');
    });

    afterNextRender(() => {
      // Mantiene correctas las posiciones de ScrollTrigger cuando el alto de la página cambia
      // (imágenes que cargan, cambio de ruta): evita quedarse a medias o con secciones en blanco.
      let timer: ReturnType<typeof setTimeout> | undefined;
      const refresh = () => {
        clearTimeout(timer);
        timer = setTimeout(() => ScrollTrigger.refresh(), 250);
      };
      new ResizeObserver(refresh).observe(document.body);
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) refresh();
      });
    });

    afterNextRender(async () => {
      await Promise.all([
        document.fonts.ready,
        new Promise<void>(res =>
          document.readyState === 'complete'
            ? res()
            : window.addEventListener('load', () => res(), { once: true })
        ),
        new Promise<void>(res => setTimeout(res, 1300)), // tiempo mínimo del loader (que termine la animación)
      ]);
      this.loader.hide();
    })

  }
}
