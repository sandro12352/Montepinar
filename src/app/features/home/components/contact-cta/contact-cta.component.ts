import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-cta',
  templateUrl: './contact-cta.component.html',
})
export class ContactCtaComponent {
  protected requestInformation(event: SubmitEvent): void {
    event.preventDefault();
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement) || !form.reportValidity()) return;

    const data = new FormData(form);
    const project = String(data.get('project') ?? '');
    const email = String(data.get('email') ?? '');
    const message = [
      'Hola, quisiera recibir información sobre Montepinar.',
      `Proyecto de interés: ${project}`,
      `Correo electrónico: ${email}`,
    ].join('\n');

    window.open(`https://wa.me/51932284185?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }
}
