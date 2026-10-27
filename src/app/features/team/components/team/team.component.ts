import { Component } from '@angular/core';
import { ContactCtaComponent } from '../../../home/components/contact-cta/contact-cta.component';
import { TeamHeroComponent } from '../team-hero/team-hero.component';
import { TeamMembersComponent } from '../team-members/team-members.component';

@Component({
  imports: [TeamHeroComponent, TeamMembersComponent, ContactCtaComponent],
  selector: 'app-team',
  templateUrl: './team.component.html',
})
export class TeamComponent {}
