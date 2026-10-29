import { afterNextRender, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMessageCircle, lucidePhone } from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface FooterLink {
  readonly label: string;
  readonly href: string;
}

interface FooterColumn {
  readonly title: string;
  readonly links: readonly FooterLink[];
}

@Component({
  imports: [NgIcon],
  providers: [provideIcons({ lucideMessageCircle, lucidePhone })],
  selector: 'app-footer',
  styleUrl: './footer.component.css',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly year = new Date().getFullYear();

  protected readonly columns: readonly FooterColumn[] = [
    {
      title: 'Proyectos',
      links: [
        { label: 'Palmeras de Montepinar', href: '/projects/chancay' },
        { label: 'Asociación Montepinar', href: '/projects/huaral' },
        { label: 'Amazon Lodge Montepinar', href: '/projects/iquitos' },
      ],
    },
    {
      title: 'Enlaces',
      links: [
        { label: 'Nosotros', href: '/about' },
        { label: 'Galería', href: '#galeria' },
        { label: 'Preguntas frecuentes', href: '#preguntas-frecuentes' },
      ],
    },
    {
      title: 'Contacto',
      links: [
        { label: 'WhatsApp', href: 'https://wa.me/51932284185' },
        { label: 'Agendar visita', href: '#contacto' },
      ],
    },
  ];

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const items = Array.from(root.querySelectorAll<HTMLElement>('[data-footer-reveal]'));
        const image = root.querySelector<HTMLElement>('[data-footer-image]');

        gsap.fromTo(items,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: root, start: 'top 85%', once: true },
          },
        );

        // Mismo acercamiento lento del banner principal, solo sobre la imagen.
        const zoom = root.querySelector<HTMLElement>('[data-footer-zoom]');
        if (image && zoom) {
          gsap.fromTo(zoom,
            { scale: 1 },
            {
              scale: 1.2,
              duration: 20,
              ease: 'none',
              repeat: -1,
              yoyo: true,
              scrollTrigger: { trigger: image, start: 'top 95%', once: true },
            },
          );
        }

        if (image) {
          gsap.fromTo(image,
            { autoAlpha: 0, y: 40 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              ease: 'power2.out',
              scrollTrigger: { trigger: image, start: 'top 95%', once: true },
            },
          );
        }
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });
  }
}
