import { Service } from '@angular/core';

@Service()
export class VisitSheetService {
  private opener: (() => void) | null = null;

  register(opener: () => void): () => void {
    this.opener = opener;
    return () => {
      if (this.opener === opener) this.opener = null;
    };
  }

  open(): void {
    this.opener?.();
  }
}
