import { afterRenderEffect, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { form, FormField, FormRoot, maxLength, minLength, pattern, required, submit, validate } from '@angular/forms/signals';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideCheck, lucideShieldCheck } from '@ng-icons/lucide';
import { BrnSheet } from '@spartan-ng/brain/sheet';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDatePickerImports, provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { gsap } from 'gsap';

import { VisitSheetService } from '../../../core/services/visit-sheet.service';

interface VisitModel {
  name: string;
  phone: string;
  pickup: string;
  date: Date | null;
  notes: string;
}

const EMPTY_MODEL: VisitModel = {
  name: '',
  phone: '',
  pickup: '',
  date: null,
  notes: '',
};

interface PickupPoint {
  readonly place: string;
  readonly reference?: string;
  readonly time: string;
}

const PICKUP_POINTS: readonly PickupPoint[] = [
  { place: 'Av. Alfredo Mendiola 3683', reference: 'Al costado del BBVA o de la Notaría Gómez Verástegui', time: '8:30 am' },
  { place: 'Frente a Tottus Puente Piedra', time: '9:00 am' },
  { place: 'Paradero Fundición de Puente Piedra', time: '9:15 am' },
];

// Feriados nacionales de Perú (mes-día). Las visitas solo se hacen los domingos que no sean feriado.
const HOLIDAYS = new Set(['1-1', '5-1', '6-7', '6-29', '7-23', '7-28', '7-29', '8-6', '8-30', '10-8', '11-1', '12-8', '12-9', '12-25']);

const isVisitDay = (date: Date): boolean => date.getDay() === 0 && !HOLIDAYS.has(`${date.getMonth() + 1}-${date.getDate()}`);

const VISIT_OPTIONS = 3;

const nextVisitDays = (): Date[] => {
  const days: Date[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (days.length < VISIT_OPTIONS) {
    if (isVisitDay(cursor)) days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
};

const formatLongDate = (date: Date): string =>
  date.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

@Component({
  selector: 'app-visit-sheet',
  imports: [
    FormField,
    FormRoot,
    NgIcon,
    HlmButtonImports,
    HlmDatePickerImports,
    HlmFieldImports,
    HlmInputImports,
    HlmSelectImports,
    HlmSheetImports,
    HlmTextareaImports,
  ],
  providers: [
    provideIcons({ lucideArrowRight, lucideCheck, lucideShieldCheck }),
    provideHlmDatePickerConfig<Date>({
      autoCloseOnSelect: true,
      formatDate: formatLongDate,
    }),
  ],
  styleUrl: './visit-sheet.component.css',
  templateUrl: './visit-sheet.component.html',
})
export class VisitSheetComponent {
  protected readonly submitted = signal(false);
  protected readonly submitting = signal(false);
  protected readonly pickupPoints = PICKUP_POINTS;
  protected readonly isDateDisabled = (date: Date): boolean =>
    !this.visitDays.some((day) => day.getTime() === new Date(date).setHours(0, 0, 0, 0));
  protected readonly visitDays = nextVisitDays();
  protected readonly firstVisitDay = this.visitDays[0];
  protected readonly lastVisitDay = this.visitDays[this.visitDays.length - 1];

  private readonly sheet = viewChild(BrnSheet);
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly success = viewChild<ElementRef<HTMLElement>>('success');

  private readonly model = signal<VisitModel>({ ...EMPTY_MODEL });
  protected readonly visitForm = form(this.model, (schema) => {
    required(schema.name, { message: 'Escribe tu nombre completo.' });
    minLength(schema.name, 2, { message: 'El nombre debe tener al menos 2 caracteres.' });
    required(schema.phone, { message: 'Escribe un teléfono para poder contactarte.' });
    pattern(schema.phone, /^\+?[\d\s()-]{7,20}$/, { message: 'Escribe un número de teléfono válido.' });
    required(schema.pickup, { message: 'Selecciona el punto de recojo.' });
    required(schema.date, { message: 'Selecciona una fecha para tu visita.' });
    validate(schema.date, ({ value }) => {
      const selectedDate = value();
      if (!selectedDate) return undefined;

      if (selectedDate < this.startOfToday()) return { kind: 'pastDate', message: 'Selecciona hoy o una fecha futura.' };
      return this.isDateDisabled(selectedDate) ? { kind: 'notVisitDay', message: 'Elige uno de los próximos 3 domingos disponibles.' } : undefined;
    });
    maxLength(schema.notes, 500, { message: 'El mensaje no puede superar los 500 caracteres.' });
  });

  protected readonly selectedDateLabel = () => {
    const date = this.model().date;
    return date ? formatLongDate(date) : '';
  };
  protected readonly selectedPickup = () => this.model().pickup;

  constructor() {
    const unregister = inject(VisitSheetService).register(() => this.openSheet());
    inject(DestroyRef).onDestroy(unregister);

    // El panel vive dentro del portal del sheet: se crea en cada apertura, así que esto
    // anima el contenido interno sin tocar la transición propia de Spartan.
    afterRenderEffect((onCleanup) => {
      const panel = this.panel()?.nativeElement;
      if (!panel || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const context = gsap.context(() => {
        const timeline = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.12 });

        timeline
          .fromTo('[data-sheet-glow]', { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 1.2, stagger: 0.15 }, 0)
          .fromTo('[data-sheet-head]', { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.09 }, 0.05)
          .fromTo('[data-sheet-field]', { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.07 }, 0.35);
      }, panel);

      onCleanup(() => context.revert());
    });

    afterRenderEffect((onCleanup) => {
      const success = this.success()?.nativeElement;
      if (!success || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const context = gsap.context(() => {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .fromTo('[data-success-badge]', { autoAlpha: 0, scale: 0.3, rotate: -20 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(2)' })
          .fromTo('[data-success-item]', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.09 }, 0.2);
      }, success);

      onCleanup(() => context.revert());
    });
  }

  protected submitVisit(): void {
    if (this.submitting() || this.submitted()) return;

    submit(this.visitForm, async () => {
      this.submitting.set(true);
      await new Promise((resolve) => setTimeout(resolve, 900));
      this.submitting.set(false);
      this.submitted.set(true);
    });
  }

  openSheet(): void {
    if (this.submitted()) {
      this.submitted.set(false);
      this.model.set({ ...EMPTY_MODEL });
      this.visitForm().reset();
    }

    this.sheet()?.open();
  }

  private startOfToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }
}
