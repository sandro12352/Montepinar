import { Service } from '@angular/core';

@Service()
export class VisitSheetService {
  private opener: (() => void) | null = null;
  private pendingOpen = false;

  register(opener: () => void): () => void {
    this.opener = opener;

    // El sheet se carga en diferido: si lo pidieron antes de estar listo, se abre al registrarse.
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
