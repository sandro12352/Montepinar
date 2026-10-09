import { DOCUMENT, inject, Service, signal } from '@angular/core';
import { gsap } from 'gsap';

@Service()
export class LoaderService {
    private doc = inject(DOCUMENT);
    readonly ready = signal(false);


    hide() {
        const el = this.doc.getElementById('app-loader');
        if (!el) { this.ready.set(true); return; }

        gsap.to(el, {
            opacity: 0,
            duration: 0.1,
            onComplete: () => {
                el.remove();
                this.ready.set(true); // 👈 desde aquí arrancan las animaciones del inicio
            },
        });
    }


}
