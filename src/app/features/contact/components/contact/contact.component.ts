import { Component } from '@angular/core';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { ContactHeroComponent } from '../contact-hero/contact-hero.component';
import { ContactInfoComponent } from '../contact-info/contact-info.component';
import { ContactMapComponent } from '../contact-map/contact-map.component';
import { ContactStatementComponent } from '../contact-statement/contact-statement.component';

@Component({
  imports: [ContactHeroComponent, ContactFormComponent, ContactInfoComponent, ContactStatementComponent, ContactMapComponent],
  selector: 'app-contact',
  templateUrl: './contact.component.html',
})
export class ContactComponent {}
