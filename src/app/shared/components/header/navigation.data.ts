import { PROJECTS } from '../../../features/projects/data/projects.data';

export interface NavigationAction {
  readonly label: string;
  readonly path?: string;
  readonly anchor?: string;
  // Fragmento de la ruta (por ejemplo, la sección legal de un proyecto).
  readonly fragment?: string;
  // Acción en lugar de navegación (abre el sheet de visita).
  readonly action?: 'visit';
}

export interface NavigationChild extends NavigationAction {
  readonly description: string;
  // Imagen que se muestra en la vista previa al pasar sobre la opción.
  readonly image: string;
}

export interface NavigationItem {
  readonly label: string;
  // Ruta de página (se marca como activa) o ancla de la home.
  readonly path?: string;
  readonly anchor?: string;
  // Desplegable: lista con vista previa y un enlace al pie.
  readonly menu?: {
    readonly eyebrow: string;
    readonly links: readonly NavigationChild[];
    readonly footer: NavigationAction;
  };
}

export const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  { label: 'Nosotros', path: '/nosotros' },
  { label: 'Equipo', path: '/equipo' },
  {
    label: 'Proyectos',
    path: '/proyectos',
    menu: {
      eyebrow: 'Nuestros proyectos',
      links: PROJECTS.map((project) => ({
        label: project.name,
        description: project.category,
        image: project.image,
        path: `/proyectos/${project.slug}`,
      })),
      footer: { label: 'Ver todos los proyectos', path: '/proyectos' },
    },
  },
  { label: 'Información legal', path: '/informacion-legal' },
  {
    label: 'Recorridos',
    menu: {
      eyebrow: 'Conoce Montepinar',
      links: [
        { label: 'Visita guiada', description: 'Recórrelo en persona con un asesor', image: '/images/carousel/slide3.webp', path: '/visita-guiada' },
        { label: 'Galería', description: 'Cada rincón, en imágenes', image: '/images/gallery/presentacion.webp', path: '/galeria' },
      ],
      footer: { label: 'Preguntas frecuentes', path: '/', fragment: 'preguntas-frecuentes' },
    },
  },
  { label: 'Blog', path: '/blog' },
  { label: 'Contacto', path: '/contacto' },
];
