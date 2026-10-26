import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideBrnCalendarI18n } from '@spartan-ng/brain/calendar';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(),
    provideBrnCalendarI18n({
      formatWeekdayName: (index) => ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'][index],
      months: () => ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      formatHeader: (month, year) =>
        new Date(year, month).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' }),
      formatMonth: (month) => new Date(2000, month).toLocaleDateString('es-PE', { month: 'short' }),
      labelPrevious: () => 'Ir al mes anterior',
      labelNext: () => 'Ir al mes siguiente',
      labelWeekday: (index) =>
        ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][index],
      firstDayOfWeek: () => 1,
    }),
  ]
};
