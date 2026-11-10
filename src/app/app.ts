import { afterNextRender, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LoaderService } from './core/services/loader.service';
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
  protected readonly title = signal('Montepinar');

  constructor() {
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
