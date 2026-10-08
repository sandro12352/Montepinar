import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './core/services/loading.service';
import { LoadingComponent } from './shared/components/loading/loading.component';

@Component({
  imports: [RouterOutlet, LoadingComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Montepinar');

  loadingService = inject(LoadingService);

  constructor() {

    this.loadingService.show();

    setTimeout(() => {
      this.loadingService.hide();
    }, 3000);

  }

}
