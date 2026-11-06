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

        // Se reparte el trabajo en frames distintos para evitar un tirón en equipos modestos:
        // 1) se libera el scroll (reflow) con el loader aún tapando, 2) se recalculan los
        // ScrollTrigger, 3) el loader se desvanece con una transición CSS (compositor, sin JS)
        // y 4) solo al terminar arrancan las animaciones del inicio.
        requestAnimationFrame(() => {
            el.classList.add('is-leaving');
            requestAnimationFrame(() => {
                ScrollTrigger.refresh();
                requestAnimationFrame(() => {
                    let done = false;
                    const finish = () => {
                        if (done) return;
                        done = true;
                        el.remove();
                        this.ready.set(true); // 👈 desde aquí arrancan las animaciones del inicio
                    };
                    el.addEventListener('transitionend', finish, { once: true });
                    setTimeout(finish, 700); // respaldo
                    el.classList.add('is-fading');
                });
            });
        });
    }

}
