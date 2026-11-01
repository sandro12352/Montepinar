import { DOCUMENT, inject, Service, signal } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Service()
export class LoaderService {
    private doc = inject(DOCUMENT);
    readonly ready = signal(false);


    hide() {
        const el = this.doc.getElementById('app-loader');
        if (!el) { this.ready.set(true); return; }

        // Se libera el scroll y se recalculan los ScrollTrigger mientras el loader aún tapa la
        // pantalla: así ese trabajo pesado no coincide con las animaciones de entrada.
        el.classList.add('is-leaving');
        ScrollTrigger.refresh();

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
