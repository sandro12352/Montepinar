import { Component } from '@angular/core';
import { MainBannerComponent } from '../main-banner/main-banner.component';
import { IntroduccionComponent } from '../introduccion/introduccion.component';
import { ProyectsComponent } from '../proyects/proyects.component';
import { Vision360Component } from '../vision360/vision360.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { ContactCtaComponent } from '../contact-cta/contact-cta.component';

@Component({
  imports: [MainBannerComponent, IntroduccionComponent, ProyectsComponent, Vision360Component, TestimonialsComponent, GalleryComponent, ContactCtaComponent],
  selector: 'app-home',
  styleUrl: './home.component.css',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  

}
