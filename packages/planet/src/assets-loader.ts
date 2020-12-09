import { Injectable } from '@angular/core';
import { hashCode, isEmpty, getScriptsAndStylesFullPaths, debug } from './helpers';
import { of, Observable, Observer, forkJoin, concat, merge } from 'rxjs';
import { tap, shareReplay, map, switchMap, switchAll, concatMap, concatAll, scan, reduce } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { PlanetApplication } from './planet.class';

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

    constructor(private http: HttpClient) {}

    loadScript(src: string): Observable<AssetsLoadResult> {
        debug(`load '${src}' start`);
        const id = hashCode(src);
        if (this.loadedSources.includes(id)) {
            debug(`load '${src}' successfully from cache`);
            return of({
                src: src,
                hashCode: id,
                loaded: true,
                status: 'Loaded'
            });
        }
        return new Observable((observer: Observer<AssetsLoadResult>) => {
            const script: HTMLScriptElement = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            script.async = true;
            if (script['readyState']) {
                // IE
                script['onreadystatechange'] = () => {
                    if (script['readyState'] === 'loaded' || script['readyState'] === 'complete') {
                        script['onreadystatechange'] = null;
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
            script.onerror = error => {
                observer.error({
                    src: src,
                    hashCode: id,
                    loaded: false,
                    status: 'Error',
                    error: error
                });
                observer.complete();
            };
            document.body.appendChild(script);
            debug(`load '${src}' successfully`);
        });
    }

    loadStyle(src: string): Observable<AssetsLoadResult> {
        debug(`load '${src}' start`);
        const id = hashCode(src);
        if (this.loadedSources.includes(id)) {
            debug(`load '${src}' successfully from cache`);
            return of({
                src: src,
                hashCode: id,
                loaded: true,
                status: 'Loaded'
            });
        }
        return new Observable((observer: Observer<AssetsLoadResult>) => {
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
            debug(`load '${src}' successfully`);
        });
    }

    loadScripts(sources: string[], serial = false): Observable<AssetsLoadResult[]> {
        if (isEmpty(sources)) {
            return of(null);
        }
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
            return forkJoin(observables).pipe();
        }
    }

    loadStyles(sources: string[]): Observable<AssetsLoadResult[]> {
        if (isEmpty(sources)) {
            return of(null);
        }
        return forkJoin(
            sources.map(src => {
                return this.loadStyle(src);
            })
        );
    }

    loadScriptsAndStyles(scripts: string[] = [], styles: string[] = [], serial = false) {
        return forkJoin([this.loadScripts(scripts, serial), this.loadStyles(styles)]);
    }

    loadAppAssets(app: PlanetApplication) {
        if (app.manifest) {
            return this.loadManifest(`${app.manifest}?t=${new Date().getTime()}`).pipe(
                switchMap(manifestResult => {
                    const { scripts, styles } = getScriptsAndStylesFullPaths(app, manifestResult);
                    return this.loadScriptsAndStyles(scripts, styles, app.loadSerial);
                })
            );
        } else {
            const { scripts, styles } = getScriptsAndStylesFullPaths(app);
            return this.loadScriptsAndStyles(scripts, styles, app.loadSerial);
        }
    }

    loadManifest(url: string): Observable<{ [key: string]: string }> {
        debug(`load '${url}' start`);
        return this.http.get(url).pipe(
            map((response: any) => {
                debug(`load '${url}' successfully`);
                return response;
            })
        );
    }
}
