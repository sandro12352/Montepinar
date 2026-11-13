import { NgOptimizedImage } from '@angular/common';
import { Component, computed, effect, ElementRef, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { map } from 'rxjs';
import { blogPostingJsonLd, breadcrumbJsonLd } from '../../../../core/seo/structured-data';
import { SeoService } from '../../../../core/services/seo.service';
import { ContactCtaComponent } from '../../../home/components/contact-cta/contact-cta.component';
import { BLOG_POSTS, formatBlogDate, getBlogPost } from '../../data/blog.data';

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

  constructor() {
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
