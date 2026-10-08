import { computed, Service, signal } from '@angular/core';

@Service()
export class LoadingService {
    private requests = signal(0);

    readonly loading = computed(() => this.requests() > 0);

    show(): void {
        this.requests.update(value => value + 1);
    }

    hide(): void {
        this.requests.update(value => Math.max(0, value - 1));
    }

    reset(): void {
        this.requests.set(0);
    }
}
