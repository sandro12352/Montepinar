import { Component } from '@angular/core';
import { ContactCtaComponent } from '../../../home/components/contact-cta/contact-cta.component';
import { LegalInformationDocumentsComponent } from '../legal-information-documents/legal-information-documents.component';
import { LegalInformationHeroComponent } from '../legal-information-hero/legal-information-hero.component';

@Component({
  imports: [LegalInformationHeroComponent, LegalInformationDocumentsComponent, ContactCtaComponent],
  selector: 'app-legal-information',
  templateUrl: './legal-information.component.html',
})
export class LegalInformationComponent {}
