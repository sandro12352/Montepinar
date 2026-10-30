import { Service } from '@angular/core';

/** Abre el menú móvil, que se carga en diferido: si lo piden antes de estar listo, se abre al registrarse. */
@Service()
export class MobileMenuService {
  private opener: (() => void) | null = null;
  private pendingOpen = false;

  register(opener: () => void): () => void {
    this.opener = opener;

    if (this.pendingOpen) {
      this.pendingOpen = false;
      opener();
    }

    return () => {
      if (this.opener === opener) this.opener = null;
    };
  }

  open(): void {
    if (this.opener) this.opener();
    else this.pendingOpen = true;
  }
}
