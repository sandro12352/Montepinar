import { Routes } from '@angular/router';
import { RouteSeo } from './core/services/seo.service';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path:'',
        component:MainLayoutComponent,
        children:[
            {
                path:'',
                loadComponent:()=>import('./features/home/components/home/home.component').then(m=>m.HomeComponent),
                data: { seo: {
                    title: 'Montepinar | Lotes en Huacho e Iquitos',
                    description: 'Lotes y terrenos con áreas verdes y seguridad en Huacho e Iquitos. Con financiamiento en cuotas. Agenda tu visita guiada con Montepinar.',
                } satisfies RouteSeo }
            },
            {
                path:'nosotros',
                loadComponent:()=>import('./features/about/components/about/about.component').then(m=>m.AboutComponent),
                data: { seo: {
                    title: 'Nosotros | Montepinar Inmobiliaria & Constructora',
                    description: 'Conoce a Montepinar Inmobiliaria & Constructora: nuestro propósito, valores y cómo te acompañamos desde elegir tu lote hasta firmar tu contrato.',
                } satisfies RouteSeo }
            },
            {
                path:'proyectos',
                loadComponent:()=>import('./features/projects/components/projects/projects.component').then(m=>m.ProjectsComponent),
                data: { seo: {
                    title: 'Proyectos de lotes en Huacho e Iquitos | Montepinar',
                    description: 'Conoce Palmeras de Montepinar y la Asociación de Vivienda Montepinar, en Huacho, y Amazon Lodge, en Iquitos. Lotes desde S/ 15,000.',
                } satisfies RouteSeo }
            },
            {
                // El SEO de cada proyecto (título, descripción, imagen) lo fija el propio componente.
                path:'proyectos/:slug',
                loadComponent:()=>import('./features/projectDetail/components/project-detail/project-detail.component').then(m=>m.ProjectDetailComponent)
            },
            {
                path:'equipo',
                loadComponent:()=>import('./features/team/components/team/team.component').then(m=>m.TeamComponent),
                data: { seo: {
                    title: 'Nuestro equipo | Montepinar Inmobiliaria & Constructora',
                    description: 'Conoce a los asesores y profesionales de Montepinar que te acompañan de principio a fin en la compra de tu lote.',
                } satisfies RouteSeo }
            },
            {
                path:'galeria',
                loadComponent:()=>import('./features/gallery/components/gallery/gallery.component').then(m=>m.GalleryPageComponent),
                data: { seo: {
                    title: 'Galería de fotos | Montepinar',
                    description: 'Mira en imágenes los proyectos de Montepinar: sus áreas verdes, accesos y entorno, y los clientes que ya confiaron en nosotros.',
                } satisfies RouteSeo }
            },
            {
                path:'visita-guiada',
                loadComponent:()=>import('./features/guidedTour/components/guided-tour/guided-tour.component').then(m=>m.GuidedTourComponent),
                data: { seo: {
                    title: 'Visita guiada a nuestros proyectos | Montepinar',
                    description: 'Conoce tu futuro lote en persona: bus de ida y vuelta desde Lima, desayuno, charla del proyecto y ayuda con el trámite si decides separarlo.',
                } satisfies RouteSeo }
            },
            {
                path:'informacion-legal',
                loadComponent:()=>import('./features/legalInformation/components/legal-information/legal-information.component').then(m=>m.LegalInformationComponent),
                data: { seo: {
                    title: 'Información legal de los proyectos | Montepinar',
                    description: 'Consulta la documentación legal de cada proyecto: partida registral, habilitación urbana, estudio de suelos y más. Compra con tranquilidad.',
                } satisfies RouteSeo }
            },
            {
                path:'terminos-y-condiciones',
                loadComponent:()=>import('./features/terms/components/terms/terms.component').then(m=>m.TermsComponent),
                data: { seo: {
                    title: 'Términos y condiciones | Montepinar',
                    description: 'Términos y condiciones de uso del sitio y de los servicios de Montepinar Inmobiliaria & Constructora.',
                } satisfies RouteSeo }
            },
            {
                path:'contacto',
                loadComponent:()=>import('./features/contact/components/contact/contact.component').then(m=>m.ContactComponent),
                data: { seo: {
                    title: 'Contacto y agenda de visitas | Montepinar',
                    description: 'Escríbenos por WhatsApp o visítanos en Los Olivos, Lima. Atención de lunes a sábado. Agenda tu visita a los proyectos de Montepinar.',
                } satisfies RouteSeo }
            }
        ]
    }
];
