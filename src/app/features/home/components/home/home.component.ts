import { afterNextRender, Component, ElementRef, viewChild } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MainBannerComponent } from '../main-banner/main-banner.component';
import { IntroduccionComponent } from '../introduccion/introduccion.component';
import { ProyectsComponent } from '../proyects/proyects.component';
import { Vision360Component } from '../vision360/vision360.component';
import { ResidentHelpComponent } from '../resident-help/resident-help.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { ContactCtaComponent } from '../contact-cta/contact-cta.component';
import { FaqComponent } from '../faq/faq.component';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [MainBannerComponent, IntroduccionComponent, ProyectsComponent, Vision360Component, ResidentHelpComponent, TestimonialsComponent, GalleryComponent, ContactCtaComponent, FaqComponent],
  selector: 'app-home',
  styleUrl: './home.component.css',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private readonly financingPanel = viewChild<ElementRef<HTMLElement>>('financingPanel');

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
      }, panel);

      return () => context.revert();
    });
  }
}
