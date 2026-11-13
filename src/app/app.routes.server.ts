import { RenderMode, ServerRoute } from '@angular/ssr';
import { BLOG_POSTS } from './features/blog/data/blog.data';
import { PROJECTS } from './features/projects/data/projects.data';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'proyectos/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => PROJECTS.map((project) => ({ slug: project.slug })),
  },
  {
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => BLOG_POSTS.map((post) => ({ slug: post.slug })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
