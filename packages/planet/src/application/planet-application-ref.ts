import { Observable } from 'rxjs';
import { PlanetPortalApplication } from './portal-application';

export interface PlanetApplicationRef {
    template?: string;
    get bootstrapped(): boolean;
    get selector(): string;
    bootstrap(app: PlanetPortalApplication): Observable<this>;
    navigateByUrl(url: string): void;
    getCurrentRouterStateUrl(): string;
    destroy(): void;
}
