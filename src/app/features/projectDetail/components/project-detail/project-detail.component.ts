import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { breadcrumbJsonLd, projectJsonLd } from '../../../../core/seo/structured-data';
import { SeoService } from '../../../../core/services/seo.service';
import { ContactCtaComponent } from '../../../home/components/contact-cta/contact-cta.component';
import { FaqComponent } from '../../../home/components/faq/faq.component';
import { getProjectDetail } from '../../data/project-detail.data';
import { PROJECT_SEO } from '../../data/project-seo.data';
import { ProjectDetailHeroComponent } from '../project-detail-hero/project-detail-hero.component';
import { ProjectDetailLocationComponent } from '../project-detail-location/project-detail-location.component';
import { ProjectDetailLotsComponent } from '../project-detail-lots/project-detail-lots.component';
import { ProjectDetailMainComponent } from '../project-detail-main/project-detail-main.component';
import { ProjectDetailTabsComponent } from '../project-detail-tabs/project-detail-tabs.component';
import { ProjectDetailPlansComponent } from '../project-detail-plans/project-detail-plans.component';
import { ProjectDetailSimulatorComponent } from '../project-detail-simulator/project-detail-simulator.component';

@Component({
  imports: [
    ProjectDetailHeroComponent,
    ProjectDetailTabsComponent,
    ProjectDetailMainComponent,
    ProjectDetailPlansComponent,
    ProjectDetailLotsComponent,
    ProjectDetailLocationComponent,
    ProjectDetailSimulatorComponent,
    ContactCtaComponent,
    FaqComponent,
  ],
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
})
export class ProjectDetailComponent {
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly slug = toSignal(inject(ActivatedRoute).paramMap.pipe(map((params) => params.get('slug'))));

  protected readonly project = computed(() => getProjectDetail(this.slug()));
  protected readonly selectedPlan = signal(0);

  constructor() {
    // Un slug que no existe vuelve al listado de proyectos.
    effect(() => {
      if (!this.project()) void this.router.navigate(['/proyectos']);
    });

    // SEO propio de cada proyecto: título, descripción, canonical, imagen y fichas para Google.
    effect(() => {
      const project = this.project();
      if (!project) return;
      const seo = PROJECT_SEO[project.slug];
      const path = `/proyectos/${project.slug}`;
      const description = seo?.description(project.priceFrom) ?? project.description;
      this.seo.set({
        title: seo?.title ?? `${project.name} en ${project.location} | Montepinar`,
        description,
        path,
        image: seo?.image,
        imageAlt: seo?.imageAlt,
      });
      this.seo.setJsonLd('project', projectJsonLd({
        name: project.name,
        description,
        path,
        image: project.image,
        priceFrom: project.priceFrom,
      }));
      this.seo.setJsonLd('breadcrumb', breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Proyectos', path: '/proyectos' },
        { name: project.name, path },
      ]));
    });
  }
}
