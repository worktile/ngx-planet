import { Injectable } from '@angular/core';
import { hashCode } from './helpers';
import { of, Observable, Observer, forkJoin, concat, merge } from 'rxjs';
import { tap, shareReplay, map, switchMap, switchAll, concatMap, concatAll, scan, reduce } from 'rxjs/operators';

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
                        observer.next({
                            src: src,
                            hashCode: id,
                            loaded: true,
                            status: 'Loaded'
                        });
                        observer.complete();
                        this.loadedSources.push(id);
                    }
                };
            } else {
                // Others
                script.onload = () => {
                    observer.next({
                        src: src,
                        hashCode: id,
                        loaded: true,
                        status: 'Loaded'
                    });
                    observer.complete();
                    this.loadedSources.push(id);
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

    loadStyle(src: string): Observable<AssetsLoadResult> {
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
            const head = document.getElementsByTagName('head')[0];
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = src;
            link.media = 'all';
            link.onload = () => {
                observer.next({
                    src: src,
                    hashCode: id,
                    loaded: true,
                    status: 'Loaded'
                });
                observer.complete();
                this.loadedSources.push(id);
            };
            link.onerror = error => {
                observer.error({
                    src: src,
                    hashCode: id,
                    loaded: true,
                    status: 'Loaded',
                    error: error
                });
                observer.complete();
            };
            head.appendChild(link);
        });
    }

    loadScripts(sources: string[], serial = false): Observable<AssetsLoadResult[]> {
        const observables = sources.map(src => {
            return this.loadScript(src);
        });
        if (serial) {
            const a = concat(...observables).pipe(
                map(item => {
                    return of([item]);
                }),
                concatAll()
            );
            return a;
        } else {
            return forkJoin(observables);
        }
    }

    loadStyles(sources: string[]): Observable<AssetsLoadResult[]> {
        return forkJoin(
            sources.map(src => {
                return this.loadStyle(src);
            })
        );
    }

    loadScriptsAndStyles(scripts: string[] = [], styles: string[] = [], serial = false) {
        return concat(this.loadScripts(scripts, serial), this.loadStyles(styles));
    }
}
