import { NgOptimizedImage } from '@angular/common';
import { afterRenderEffect, Component, computed, DestroyRef, effect, ElementRef, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { map } from 'rxjs';
import { LoaderService } from '../../../../core/services/loader.service';
import { blogPostingJsonLd, breadcrumbJsonLd } from '../../../../core/seo/structured-data';
import { SeoService } from '../../../../core/services/seo.service';
import { ContactCtaComponent } from '../../../home/components/contact-cta/contact-cta.component';
import { BLOG_POSTS, formatBlogDate, getBlogPost } from '../../data/blog.data';

gsap.registerPlugin(ScrollTrigger);

@Component({
  imports: [NgOptimizedImage, RouterLink, HlmBreadcrumbImports, ContactCtaComponent],
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
})
export class BlogPostComponent {
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly slug = toSignal(inject(ActivatedRoute).paramMap.pipe(map((params) => params.get('slug'))));

  protected readonly post = computed(() => getBlogPost(this.slug()));
  /** Todos los demás artículos, empezando por los que siguen al actual y dando la vuelta al llegar al final. */
  protected readonly others = computed(() => {
    const index = BLOG_POSTS.findIndex((item) => item.slug === this.post()?.slug);
    if (index < 0) return [];
    return [...BLOG_POSTS.slice(index + 1), ...BLOG_POSTS.slice(0, index)];
  });

  private readonly track = viewChild<ElementRef<HTMLElement>>('track');

  /** Mueve el carrusel de "Sigue leyendo" una página hacia la izquierda (-1) o la derecha (1). */
  protected scrollOthers(direction: -1 | 1): void {
    const track = this.track()?.nativeElement;
    if (!track) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior: reduce ? 'auto' : 'smooth' });
  }
  protected readonly formatDate = formatBlogDate;

  /**
   * Lleva a una sección del índice dejando el título bajo el menú fijo (usa su scroll-margin-top).
   * Se calcula aquí porque el scroll de anclas de Angular ignora ese margen y mide el título
   * mientras la animación de entrada lo tiene desplazado.
   */
  protected goToSection(event: Event, number: number): void {
    const target = document.getElementById(`seccion-${number}`);
    if (!target) return;
    event.preventDefault();
    const style = getComputedStyle(target);
    const shift = new DOMMatrixReadOnly(style.transform).m42;
    const top = target.getBoundingClientRect().top - shift + window.scrollY - (parseFloat(style.scrollMarginTop) || 0);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  }

  private readonly destroyRef = inject(DestroyRef);
  private readonly loaderService = inject(LoaderService);
  private readonly root = viewChild<ElementRef<HTMLElement>>('root');
  private context?: gsap.Context;

  constructor() {
    this.destroyRef.onDestroy(() => this.context?.revert());

    // Animación de entrada y de scroll. Se repite al pasar a otro artículo (el componente se reutiliza).
    afterRenderEffect(() => {
      const root = this.root()?.nativeElement;
      this.post();
      if (!root || !this.loaderService.ready()) return;

      this.context?.revert();
      this.context = gsap.context(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        gsap.fromTo(
          '[data-hero]',
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', delay: 0.1 },
        );

        gsap.set('[data-fade]', { autoAlpha: 0, y: 28 });

        ScrollTrigger.batch('[data-fade]', {
          start: 'top 88%',
          once: true,
          onEnter: (items) =>
            gsap.to(items, { autoAlpha: 1, y: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out', overwrite: true, clearProps: 'all' }),
        });
      }, root);
    });

    // Un artículo que no existe vuelve al listado del blog.
    effect(() => {
      if (!this.post()) void this.router.navigate(['/blog']);
    });

    // SEO propio de cada artículo: título, descripción, imagen para compartir y fichas para Google.
    effect(() => {
      const post = this.post();
      if (!post) return;
      const path = `/blog/${post.slug}`;
      this.seo.set({
        title: post.seoTitle,
        description: post.seoDescription,
        path,
        image: post.ogImage,
        imageAlt: post.imageAlt,
        type: 'article',
      });
      this.seo.setJsonLd('post', blogPostingJsonLd({
        title: post.title,
        description: post.seoDescription,
        path,
        image: post.ogImage,
        datePublished: post.datePublished,
        dateModified: post.dateModified,
      }));
      this.seo.setJsonLd('breadcrumb', breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: post.title, path },
      ]));
    });
  }
}
