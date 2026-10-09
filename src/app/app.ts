import { afterNextRender, Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderService } from './core/services/loader.service';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private loader = inject(LoaderService);
  protected readonly title = signal('Montepinar');

  constructor() {
    afterNextRender(async () => {
      await Promise.all([
        document.fonts.ready,
        new Promise<void>(res =>
          document.readyState === 'complete'
            ? res()
            : window.addEventListener('load', () => res(), { once: true })
        ),
        new Promise<void>(res => setTimeout(res, 1500)), // tiempo mínimo del loader
      ]);
      this.loader.hide();
    })

  }
}
