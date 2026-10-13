import { afterRenderEffect, Component, input, signal, viewChild } from '@angular/core';
import { email, form, FormField, FormRoot, maxLength, minLength, pattern, required, submit, validate } from '@angular/forms/signals';
import { BrnSheet } from '@spartan-ng/brain/sheet';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
  selector: 'app-visit-sheet',
  imports: [FormField, FormRoot, HlmButtonImports, HlmFieldImports, HlmInputImports, HlmSheetImports, HlmTextareaImports],
  styleUrl: './visit-sheet.component.css',
  templateUrl: './visit-sheet.component.html',
})
export class VisitSheetComponent {
  protected readonly submitted = signal(false);
  private readonly sheet = viewChild(BrnSheet);

  private readonly model = signal({
    name: '',
    phone: '',
    email: '',
    project: '',
    date: '',
    time: '',
    notes: '',
  });
  protected readonly visitForm = form(this.model, (schema) => {
    required(schema.name, { message: 'Escribe tu nombre completo.' });
    minLength(schema.name, 2, { message: 'El nombre debe tener al menos 2 caracteres.' });
    required(schema.phone, { message: 'Escribe un teléfono para poder contactarte.' });
    pattern(schema.phone, /^\+?[\d\s()-]{7,20}$/, { message: 'Escribe un número de teléfono válido.' });
    email(schema.email, { message: 'Revisa el formato del correo electrónico.' });
    required(schema.project, { message: 'Selecciona el proyecto que deseas visitar.' });
    required(schema.date, { message: 'Selecciona una fecha para tu visita.' });
    validate(schema.date, ({ value }) => {
      const dateValue = value();
      if (!dateValue) return undefined;

      const selectedDate = new Date(`${dateValue}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate < today
        ? { kind: 'pastDate', message: 'Selecciona hoy o una fecha futura.' }
        : undefined;
    });
    required(schema.time, { message: 'Selecciona un horario de preferencia.' });
    maxLength(schema.notes, 500, { message: 'El mensaje no puede superar los 500 caracteres.' });
  });


  protected submitVisit(): void {
    submit(this.visitForm, async () => {
      const { name, phone, email: emailAddress, project, date, time, notes } = this.model();
      const message = [
        'Hola, quisiera agendar una visita a Montepinar.',
        `Nombre: ${name}`,
        `Teléfono: ${phone}`,
        emailAddress ? `Correo: ${emailAddress}` : '',
        `Proyecto: ${project}`,
        `Fecha preferida: ${date}`,
        `Horario preferido: ${time}`,
        notes ? `Comentarios: ${notes}` : '',
      ].filter(Boolean).join('\n');

      window.open(`https://wa.me/51932284185?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
      this.submitted.set(true);
    });
  }


  openSheet(): void {
    this.sheet()?.open();
  }


}
