import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFacebook, lucideInstagram } from '@ng-icons/lucide';
import { SOCIAL_LINKS } from '../../../features/contact/data/contact.data';

@Component({
  imports: [NgIcon],
  providers: [provideIcons({ lucideFacebook, lucideInstagram })],
  selector: 'app-social-links',
  templateUrl: './social-links.component.html',
})
export class SocialLinksComponent {
  /** 'icons': círculos compactos (footer). 'pills': ícono con el nombre de la red (contacto). */
  readonly variant = input<'icons' | 'pills'>('icons');

  protected readonly links = SOCIAL_LINKS;
}
