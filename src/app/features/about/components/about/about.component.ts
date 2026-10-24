import { Component } from '@angular/core';
import { ContactCtaComponent } from '../../../home/components/contact-cta/contact-cta.component';
import { FaqComponent } from '../../../home/components/faq/faq.component';
import { TestimonialsComponent } from '../../../home/components/testimonials/testimonials.component';
import { AboutHeroComponent } from '../about-hero/about-hero.component';
import { AboutProcessComponent } from '../about-process/about-process.component';
import { AboutPurposeComponent } from '../about-purpose/about-purpose.component';
import { AboutStatementComponent } from '../about-statement/about-statement.component';
import { AboutStatsComponent } from '../about-stats/about-stats.component';
import { AboutValuesComponent } from '../about-values/about-values.component';
import { AboutWhoComponent } from '../about-who/about-who.component';

@Component({
  imports: [
    AboutHeroComponent,
    AboutWhoComponent,
    AboutPurposeComponent,
    AboutStatementComponent,
    AboutProcessComponent,
    AboutValuesComponent,
    AboutStatsComponent,
    TestimonialsComponent,
    ContactCtaComponent,
    FaqComponent,
  ],
  selector: 'app-about',
  templateUrl: './about.component.html',
})
export class AboutComponent {}
