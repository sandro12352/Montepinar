import { Component } from '@angular/core';
import { MainBannerComponent } from '../main-banner/main-banner.component';
import { IntroduccionComponent } from '../introduccion/introduccion.component';

@Component({
  imports: [MainBannerComponent, IntroduccionComponent],
  selector: 'app-home',
  styleUrl: './home.component.css',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  

}
