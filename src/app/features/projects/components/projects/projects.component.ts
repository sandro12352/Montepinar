import { Component } from '@angular/core';
import { ContactCtaComponent } from '../../../home/components/contact-cta/contact-cta.component';
import { FaqComponent } from '../../../home/components/faq/faq.component';
import { ProjectsBenefitsComponent } from '../projects-benefits/projects-benefits.component';
import { ProjectsHeroComponent } from '../projects-hero/projects-hero.component';
import { ProjectsShowcaseComponent } from '../projects-showcase/projects-showcase.component';

@Component({
  imports: [
    ProjectsHeroComponent,
    ProjectsShowcaseComponent,
    ProjectsBenefitsComponent,
    ContactCtaComponent,
    FaqComponent,
  ],
  selector: 'app-projects',
  templateUrl: './projects.component.html',
})
export class ProjectsComponent {}
