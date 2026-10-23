import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronLeft,
  lucideChevronRight,
  lucideHand,
  lucideMapPin,
  lucideRotate3d,
  lucideX,
} from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Scene {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly image: string;
}

@Component({
  imports: [NgIcon],
  providers: [
    provideIcons({ lucideChevronLeft, lucideChevronRight, lucideHand, lucideMapPin, lucideRotate3d, lucideX }),
  ],
  selector: 'app-vision360',
  styleUrl: './vision360.component.css',
  templateUrl: './vision360.component.html',
})
export class Vision360Component {
  private readonly destroyRef = inject(DestroyRef);
  private readonly root = viewChild.required<ElementRef<HTMLElement>>('root');

  protected readonly scenes: readonly Scene[] = [
    {
      id: 'entrada',
      label: 'Entrada',
      description: 'Acceso principal y áreas verdes de Montepinar.',
      image: '/images/entrada.png',
    },
    {
      id: 'chancay',
      label: 'Chancay',
      description: 'Costa emergente con vistas abiertas al mar.',
      image: '/images/PalmerasdeMontepinar.png',
    },
    {
      id: 'huaral',
      label: 'Huaral',
      description: 'Áreas recreativas y deportivas en el valle fértil.',
      image: '/images/AsociacionMontepinar.webp',
    },
    {
      id: 'iquitos',
      label: 'Iquitos',
      description: 'El pulmón verde: naturaleza y comunidad.',
      image: '/images/MontepinarIquitos.webp',
    },
    {
      id: 'sala-de-ventas',
      label: 'Sala de ventas',
      description: 'Conoce el plano del proyecto con nuestro equipo.',
      image: '/images/presentacion.webp',
    },
  ];

  protected readonly isOpen = signal(false);
  protected readonly sceneIndex = signal(0);
  protected readonly backgroundPosition = signal(50);
  protected readonly currentScene = computed(() => this.scenes[this.sceneIndex()]);

  private dragStartX = 0;
  private dragStartPosition = 50;

  constructor() {
    afterNextRender(() => {
      const root = this.root().nativeElement;
      const context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const card = root.querySelector<HTMLElement>('[data-vision-image]');
        const copy = Array.from(root.querySelectorAll<HTMLElement>('[data-vision-copy] > *'));
        const playButton = root.querySelector<HTMLElement>('[data-vision-play]');
        const chips = root.querySelector<HTMLElement>('[data-vision-step]');
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top 72%',
            once: true,
          },
        });

        if (card) {
          timeline.from(card, {
            autoAlpha: 0,
            y: 56,
            duration: 0.8,
            ease: 'power3.out',
          });
        }

        timeline.from(copy, {
          autoAlpha: 0,
          y: 24,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power3.out',
        }, '-=0.35');

        if (playButton) {
          timeline.fromTo(playButton,
            { autoAlpha: 0, scale: 0.6 },
            {
              autoAlpha: 1,
              scale: 1,
              duration: 0.9,
              ease: 'elastic.out(1, 0.55)',
              clearProps: 'transform',
            },
            '-=0.3',
          );
        }

        if (chips) {
          timeline.from(chips.children, {
            autoAlpha: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
          }, '-=0.35');
        }
      }, root);

      this.destroyRef.onDestroy(() => context.revert());
    });

    this.destroyRef.onDestroy(() => this.lockScroll(false));
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (!this.isOpen()) return;
    if (event.key === 'Escape') this.closeViewer();
    else if (event.key === 'ArrowRight') this.nextScene();
    else if (event.key === 'ArrowLeft') this.prevScene();
  }

  protected openViewer(index = 0): void {
    this.goToScene(index);
    this.isOpen.set(true);
    this.lockScroll(true);
  }

  protected closeViewer(): void {
    this.isOpen.set(false);
    this.lockScroll(false);
  }

  protected goToScene(index: number): void {
    const total = this.scenes.length;
    this.sceneIndex.set((index + total) % total);
    this.backgroundPosition.set(50);
  }

  protected nextScene(): void {
    this.goToScene(this.sceneIndex() + 1);
  }

  protected prevScene(): void {
    this.goToScene(this.sceneIndex() - 1);
  }

  protected startDrag(event: PointerEvent): void {
    this.dragStartX = event.clientX;
    this.dragStartPosition = this.backgroundPosition();
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  protected moveDrag(event: PointerEvent): void {
    if (!(event.buttons & 1)) return;
    const delta = (event.clientX - this.dragStartX) / 8;
    this.backgroundPosition.set((this.dragStartPosition - delta + 100) % 100);
  }

  private lockScroll(locked: boolean): void {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = locked ? 'hidden' : '';
  }
}
