import { Component } from '@angular/core';
import { ContactCtaComponent } from '../../../home/components/contact-cta/contact-cta.component';
import { GalleryGridComponent } from '../gallery-grid/gallery-grid.component';
import { GalleryHeroComponent } from '../gallery-hero/gallery-hero.component';

@Component({
  imports: [GalleryHeroComponent, GalleryGridComponent, ContactCtaComponent],
  selector: 'app-gallery-page',
  templateUrl: './gallery.component.html',
})
export class GalleryPageComponent {}
