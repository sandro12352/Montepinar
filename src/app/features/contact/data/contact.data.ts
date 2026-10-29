export const WHATSAPP_NUMBER = '51932284185';
export const WHATSAPP_DISPLAY = '+51 932 284 185';

export const whatsappLink = (message?: string): string =>
  `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

export const OFFICE_ADDRESS = 'Jr. César Vallejo 958 Urb. Covida, Los Olivos, Lima, Perú';
export const CONTACT_EMAIL = 'informes@inmobiliariamontepinar.com.pe';

export interface ContactPhone {
  readonly label: string;
  readonly display: string;
  readonly tel: string;
}

export const CONTACT_PHONES: readonly ContactPhone[] = [
  { label: 'Oficina', display: '+51 947 780 652', tel: '+51947780652' },
  { label: 'Marketing', display: '+51 986 800 935', tel: '+51986800935' },
  { label: 'Ventas', display: '+51 914 675 637', tel: '+51914675637' },
];

export const OFFICE_HOURS: readonly { readonly days: string; readonly time: string }[] = [
  { days: 'Lunes - Viernes', time: '09:00 - 18:00' },
  { days: 'Sábados', time: '09:00 - 13:00' },
  { days: 'Domingo', time: 'Cerrado' },
];
