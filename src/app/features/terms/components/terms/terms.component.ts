import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactCtaComponent } from '../../../home/components/contact-cta/contact-cta.component';
import { TERMS_SECTIONS, TERMS_UPDATED } from '../../data/terms.data';

@Component({
  imports: [RouterLink, ContactCtaComponent],
  selector: 'app-terms',
  templateUrl: './terms.component.html',
})
export class TermsComponent {
  protected readonly sections = TERMS_SECTIONS;
  protected readonly updated = TERMS_UPDATED;
}
