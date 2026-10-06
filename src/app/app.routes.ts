import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path:'',
        component:MainLayoutComponent,
        children:[
            {
                path:'',
                loadComponent:()=>import('./features/home/components/main-banner/main-banner.component').then(m=>m.MainBannerComponent)
            }
        ]
    }
];
