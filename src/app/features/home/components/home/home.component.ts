import { afterNextRender, Component, ElementRef, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideCalculator,
  lucideLandmark,
  lucideMessageCircle,
  lucideShieldCheck,
  lucideTrendingUp,
} from '@ng-icons/lucide';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MainBannerComponent } from '../main-banner/main-banner.component';
import { IntroduccionComponent } from '../introduccion/introduccion.component';
import { HomeProjectsComponent } from '../projects/projects.component';
import { Vision360Component } from '../vision360/vision360.component';
import { ResidentHelpComponent } from '../resident-help/resident-help.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { ContactCtaComponent } from '../contact-cta/contact-cta.component';
import { FaqComponent } from '../faq/faq.component';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgIcon, MainBannerComponent, IntroduccionComponent, HomeProjectsComponent, Vision360Component, ResidentHelpComponent, TestimonialsComponent, GalleryComponent, ContactCtaComponent, FaqComponent],
  providers: [
    provideIcons({
      lucideArrowRight,
      lucideCalculator,
      lucideLandmark,
      lucideMessageCircle,
      lucideShieldCheck,
      lucideTrendingUp,
    }),
  ],
  selector: 'app-home',
  styleUrl: './home.component.css',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private readonly financingPanel = viewChild<ElementRef<HTMLElement>>('financingPanel');
  protected readonly financingBenefits = [
    { icon: 'lucideShieldCheck', label: 'Sin historial crediticio' },
    { icon: 'lucideLandmark', label: 'Cuotas desde $199/mes' },
    { icon: 'lucideTrendingUp', label: '0% interés en inicial' },
  ];

  constructor() {
    afterNextRender(() => {
      const panel = this.financingPanel()?.nativeElement;
      if (!panel) return;

      const context = gsap.context(() => {
        gsap.fromTo(panel, { autoAlpha: 0, y: 56 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: panel, start: 'top 85%', once: true },
        });
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        gsap.from('[data-reveal]', {
          autoAlpha: 0,
          y: 24,
          duration: 0.65,
          stagger: 0.1,
          delay: 0.25,
          ease: 'power2.out',
          scrollTrigger: { trigger: panel, start: 'top 85%', once: true },
        });
      }, panel);

      return () => context.revert();
    });
  }
}
