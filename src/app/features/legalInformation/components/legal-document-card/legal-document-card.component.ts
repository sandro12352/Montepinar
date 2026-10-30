import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpRight,
  lucideBadgeCheck,
  lucideBuilding2,
  lucideClock,
  lucideDroplets,
  lucideFileSignature,
  lucideFileText,
  lucideHandshake,
  lucideLandmark,
  lucideLayers,
  lucideRefreshCw,
} from '@ng-icons/lucide';
import { LegalDocument } from '../../data/legal-information.data';

@Component({
  imports: [NgIcon, DecimalPipe],
  providers: [
    provideIcons({
      lucideArrowUpRight,
      lucideBadgeCheck,
      lucideBuilding2,
      lucideClock,
      lucideDroplets,
      lucideFileSignature,
      lucideFileText,
      lucideHandshake,
      lucideLandmark,
      lucideLayers,
      lucideRefreshCw,
    }),
  ],
  selector: 'app-legal-document-card',
  templateUrl: './legal-document-card.component.html',
})
export class LegalDocumentCardComponent {
  readonly document = input.required<LegalDocument>();
  readonly index = input.required<number>();
}
