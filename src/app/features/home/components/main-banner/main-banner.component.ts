import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';

interface BannerSlide {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly action: string;
  readonly href: string;
  readonly theme: string;
  readonly video?: string;
}

@Component({
  imports: [],
  selector: 'app-main-banner',
  styleUrl: './main-banner.component.css',
  templateUrl: './main-banner.component.html',
})
export class MainBannerComponent {
  protected readonly activeSlide = signal(0);

  protected readonly slides: readonly BannerSlide[] = [
    {
      eyebrow: 'Bienvenido a Montepinar',
      title: 'Un lugar para vivir a tu manera',
      description: 'Descubre un entorno tranquilo, cercano y lleno de vida para disfrutar cada día.',
      action: 'Conoce Montepinar',
      href: '#urbanizacion',
      theme: 'bg-gradient-to-br from-[#0b5d4b] via-[#118267] to-[#f28c2d]',
      video: '/images/montepinar-banner.mp4',
    },
    {
      eyebrow: 'Naturaleza y bienestar',
      title: 'Tu entorno, tu refugio',
      description: 'Espacios abiertos, aire libre y la calma que necesitas sin renunciar a estar conectado.',
      action: 'Explora nuestro entorno',
      href: '#servicios',
      theme: 'bg-gradient-to-br from-[#064b43] via-[#197b62] to-[#75a45a]',
    },
    {
      eyebrow: 'Una comunidad activa',
      title: 'Mucho más que una urbanización',
      description: 'Información, servicios y actualidad para sentirte parte de Montepinar.',
      action: 'Ver la actualidad',
      href: '#actualidad',
      theme: 'bg-gradient-to-br from-[#174951] via-[#126d65] to-[#dc8734]',
    },
  ];

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const intervalId = window.setInterval(() => this.nextSlide(), 10000);
      this.destroyRef.onDestroy(() => window.clearInterval(intervalId));
    });
  }

  protected nextSlide(): void {
    this.activeSlide.update((current) => (current + 1) % this.slides.length);
  }

  protected previousSlide(): void {
    this.activeSlide.update((current) => (current - 1 + this.slides.length) % this.slides.length);
  }

  protected goToSlide(index: number): void {
    this.activeSlide.set(index);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.nextSlide();
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.previousSlide();
    }
  }
}
