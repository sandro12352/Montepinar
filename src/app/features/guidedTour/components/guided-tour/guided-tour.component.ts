import { Component } from '@angular/core';
import { GuidedTourCtaComponent } from '../guided-tour-cta/guided-tour-cta.component';
import { GuidedTourGalleryComponent } from '../guided-tour-gallery/guided-tour-gallery.component';
import { GuidedTourHeroComponent } from '../guided-tour-hero/guided-tour-hero.component';
import { GuidedTourIncludedComponent } from '../guided-tour-included/guided-tour-included.component';
import { GuidedTourJourneyComponent } from '../guided-tour-journey/guided-tour-journey.component';
import { GuidedTourPickupComponent } from '../guided-tour-pickup/guided-tour-pickup.component';

@Component({
  imports: [GuidedTourHeroComponent, GuidedTourIncludedComponent, GuidedTourPickupComponent, GuidedTourJourneyComponent, GuidedTourGalleryComponent, GuidedTourCtaComponent],
  selector: 'app-guided-tour',
  templateUrl: './guided-tour.component.html',
})
export class GuidedTourComponent {}
