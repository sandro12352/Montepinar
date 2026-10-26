import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gsap } from 'gsap';
import { prefersReducedMotion } from '../../utils/reveal';

gsap.registerPlugin(ScrollTrigger);

interface Tab {
  readonly id: string;
  readonly label: string;
}

@Component({
  selector: 'app-project-detail-tabs',
  templateUrl: './project-detail-tabs.component.html',
})
export class ProjectDetailTabsComponent {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly tabs: readonly Tab[] = [
    { id: 'detalle-proyecto', label: 'El proyecto' },
    { id: 'detalle-planes', label: 'Planes y precios' },
    { id: 'detalle-lotes', label: 'Plano de lotes' },
    { id: 'detalle-ubicacion', label: 'Ubicación' },
    { id: 'detalle-simulador', label: 'Simulador' },
    { id: 'detalle-legal', label: 'Información legal' },
  ];

  protected readonly active = signal(this.tabs[0].id);

  protected goTo(id: string): void {
    this.active.set(id);
    document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }

  constructor() {
    afterNextRender(() => {
      // Marca la pestaña de la sección que ocupa el centro de la pantalla.
      const triggers = this.tabs
        .map((tab) => ({ tab, element: document.getElementById(tab.id) }))
        .filter((entry): entry is { tab: Tab; element: HTMLElement } => entry.element !== null)
        .map(({ tab, element }) =>
          ScrollTrigger.create({
            trigger: element,
            start: 'top 45%',
            end: 'bottom 45%',
            onToggle: (self) => {
              if (self.isActive) this.active.set(tab.id);
            },
          }),
        );

      this.destroyRef.onDestroy(() => triggers.forEach((trigger) => trigger.kill()));
    });
  }
}
