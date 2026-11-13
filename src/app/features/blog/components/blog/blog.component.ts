import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { ContactCtaComponent } from '../../../home/components/contact-cta/contact-cta.component';
import { PROJECTS } from '../../../projects/data/projects.data';
import { BLOG_POSTS, formatBlogDate } from '../../data/blog.data';

@Component({
  imports: [NgOptimizedImage, RouterLink, HlmBreadcrumbImports, ContactCtaComponent],
  selector: 'app-blog',
  templateUrl: './blog.component.html',
})
export class BlogComponent {
  /** El primer artículo de la lista se muestra grande, como destacado. */
  protected readonly featured = BLOG_POSTS[0];
  protected readonly others = BLOG_POSTS.slice(1);
  protected readonly projects = PROJECTS;
  protected readonly formatDate = formatBlogDate;
}
