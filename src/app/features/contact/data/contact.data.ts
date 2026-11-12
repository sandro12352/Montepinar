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

// El número oficial (Oficina) es el canal principal: WhatsApp, llamadas y mensajes de toda la web usan este.
const MAIN_PHONE = CONTACT_PHONES.find((phone) => phone.label === 'Oficina') ?? CONTACT_PHONES[0];
export const WHATSAPP_NUMBER = MAIN_PHONE.tel.replace('+', '');
export const WHATSAPP_DISPLAY = MAIN_PHONE.display;
export const WHATSAPP_TEL = MAIN_PHONE.tel;

export const whatsappLink = (message?: string): string =>
  `https://wa.me/${WHATSAPP_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

export const OFFICE_ADDRESS = 'Jr. César Vallejo 958 Urb. Covida, Los Olivos, Lima, Perú';
export const CONTACT_EMAIL = 'info.inmobiliariamontelipar@gmail.com';

export const OFFICE_HOURS: readonly { readonly days: string; readonly time: string }[] = [
  { days: 'Lunes - Viernes', time: '09:00 - 18:00' },
  { days: 'Sábados', time: '09:00 - 13:00' },
  { days: 'Domingo', time: 'Cerrado' },
];

export interface SocialLink {
  readonly name: string;
  readonly href: string;
  /** Nombre del ícono lucide, o 'tiktok' (no existe en lucide, se dibuja aparte). */
  readonly icon: string;
}

// Perfiles oficiales de Montepinar en redes sociales.
export const SOCIAL_LINKS: readonly SocialLink[] = [
  { name: 'Facebook', href: 'https://www.facebook.com/MontepinarInmobiliaria', icon: 'lucideFacebook' },
  { name: 'Instagram', href: 'https://www.instagram.com/montepinar_inmobiliaria', icon: 'lucideInstagram' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@montepinarinmobiliaria', icon: 'tiktok' },
];
