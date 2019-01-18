import { Injectable } from '@angular/core';
import { hashCode } from './helpers';
import { of, Observable, Observer, forkJoin } from 'rxjs';
import { tap, shareReplay, map, switchMap } from 'rxjs/operators';

export interface AssetsLoadResult {
    src: string;
    hashCode: number;
    loaded: boolean;
    status: string;
}

@Injectable({
    providedIn: 'root'
})
export class AssetsLoader {
    private loadedSources: number[] = [];

    loadScript(src: string): Observable<AssetsLoadResult> {
        const id = hashCode(src);
        if (this.loadedSources.includes(id)) {
            return of({
                src: src,
                hashCode: id,
                loaded: true,
                status: 'Loaded'
            });
        }
        return Observable.create((observer: Observer<AssetsLoadResult>) => {
            const script: any = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            if (script.readyState) {
                // IE
                script.onreadystatechange = () => {
                    if (script.readyState === 'loaded' || script.readyState === 'complete') {
                        script.onreadystatechange = null;
                        this.loadedSources.push(id);
                        observer.next({
                            src: src,
                            hashCode: id,
                            loaded: true,
                            status: 'Loaded'
                        });
                        observer.complete();
                    }
                };
            } else {
                // Others
                this.loadedSources.push(id);
                script.onload = () => {
                    observer.next({
                        src: src,
                        hashCode: id,
                        loaded: true,
                        status: 'Loaded'
                    });
                    observer.complete();
                };
            }
            script.onerror = (error: any) => {
                observer.error({
                    src: src,
                    hashCode: id,
                    loaded: false,
                    status: 'Error'
                });
                observer.complete();
            };
            document.getElementsByTagName('head')[0].appendChild(script);
        });
    }

    loadScripts(sources: string[]): Observable<AssetsLoadResult[]> {
        return forkJoin(sources.map(src => {
            return this.loadScript(src);
        }));
    }
}
