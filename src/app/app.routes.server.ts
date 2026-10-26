import { RenderMode, ServerRoute } from '@angular/ssr';
import { PROJECTS } from './features/projects/data/projects.data';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'projects/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => PROJECTS.map((project) => ({ slug: project.slug })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
