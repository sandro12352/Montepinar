import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { ContactCtaComponent } from '../../../home/components/contact-cta/contact-cta.component';
import { FaqComponent } from '../../../home/components/faq/faq.component';
import { getProjectDetail } from '../../data/project-detail.data';
import { ProjectDetailHeroComponent } from '../project-detail-hero/project-detail-hero.component';
import { ProjectDetailLegalComponent } from '../project-detail-legal/project-detail-legal.component';
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
    ProjectDetailLegalComponent,
    ContactCtaComponent,
    FaqComponent,
  ],
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
})
export class ProjectDetailComponent {
  private readonly router = inject(Router);
  private readonly slug = toSignal(inject(ActivatedRoute).paramMap.pipe(map((params) => params.get('slug'))));

  protected readonly project = computed(() => getProjectDetail(this.slug()));
  protected readonly selectedPlan = signal(0);

  constructor() {
    // Un slug que no existe vuelve al listado de proyectos.
    effect(() => {
      if (!this.project()) void this.router.navigate(['/projects']);
    });
  }
}
