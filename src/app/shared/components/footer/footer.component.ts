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
      title: 'Navegación',
      links: [
        { label: 'Inicio', href: '#inicio' },
        { label: 'Nosotros', href: '#nosotros' },
        { label: 'Proyectos', href: '#proyectos' },
        { label: 'Visión 360°', href: '#vision-360' },
        { label: 'Testimonios', href: '#testimonios' },
      ],
    },
    {
      title: 'Proyectos',
      links: [
        { label: 'Chancay', href: '#proyectos' },
        { label: 'Huaral', href: '#proyectos' },
        { label: 'Iquitos', href: '#proyectos' },
        { label: 'Galería', href: '#galeria' },
        { label: 'Preguntas frecuentes', href: '#preguntas-frecuentes' },
      ],
    },
    {
      title: 'Contacto',
      links: [
        { label: '+51 932 284 185', href: 'tel:+51932284185' },
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
