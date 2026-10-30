import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path:'',
        component:MainLayoutComponent,
        children:[
            {
                path:'',
                loadComponent:()=>import('./features/home/components/home/home.component').then(m=>m.HomeComponent)
            },
            {
                path:'about',
                loadComponent:()=>import('./features/about/components/about/about.component').then(m=>m.AboutComponent)
            },
            {
                path:'projects',
                loadComponent:()=>import('./features/projects/components/projects/projects.component').then(m=>m.ProjectsComponent)
            },
            {
                path:'projects/:slug',
                loadComponent:()=>import('./features/projectDetail/components/project-detail/project-detail.component').then(m=>m.ProjectDetailComponent)
            },
            {
                path:'equipo',
                loadComponent:()=>import('./features/team/components/team/team.component').then(m=>m.TeamComponent)
            },
            {
                path:'visita-guiada',
                loadComponent:()=>import('./features/guidedTour/components/guided-tour/guided-tour.component').then(m=>m.GuidedTourComponent)
            },
            {
                path:'informacion-legal',
                loadComponent:()=>import('./features/legalInformation/components/legal-information/legal-information.component').then(m=>m.LegalInformationComponent)
            },
            {
                path:'terminos-y-condiciones',
                loadComponent:()=>import('./features/terms/components/terms/terms.component').then(m=>m.TermsComponent)
            },
            {
                path:'contacto',
                loadComponent:()=>import('./features/contact/components/contact/contact.component').then(m=>m.ContactComponent)
            }
        ]
    }
];
