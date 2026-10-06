import { Component, signal } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';

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
  protected readonly menuOpen = signal(false);

  protected readonly navigationItems: readonly NavigationItem[] = [
    { label: 'Inicio', fragment: 'inicio' },
    { label: 'La urbanización', fragment: 'urbanizacion' },
    { label: 'Servicios', fragment: 'servicios' },
    { label: 'Actualidad', fragment: 'actualidad' },
  ];

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
