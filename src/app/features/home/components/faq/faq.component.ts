import { Component, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-faq',
  styleUrl: './faq.component.css',
  templateUrl: './faq.component.html',
})
export class FaqComponent {
  protected readonly videoPlaying = signal(false);

  protected playVideo(video: HTMLVideoElement): void {
    void video.play().then(() => this.videoPlaying.set(true));
  }

  protected onVideoPause(): void {
    this.videoPlaying.set(false);
  }
}
