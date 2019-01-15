import { Injectable } from '@angular/core';
import { hashCode } from './helpers';

@Injectable({
    providedIn: 'root'
})
export class AssetsLoader {
    private loadedSources: number[] = [];

    loadScript(src: string) {
        const id = hashCode(src);
        if (this.loadedSources.includes(id)) {
            return Promise.resolve({
                src: src,
                hashCode: id,
                loaded: true,
                status: 'Loaded'
            });
        }
        return new Promise((resolve, reject) => {
            const script: any = document.createElement('script');
            script.type = 'text/javascript';
            script.src = src;
            if (script.readyState) {
                // IE
                script.onreadystatechange = () => {
                    if (script.readyState === 'loaded' || script.readyState === 'complete') {
                        script.onreadystatechange = null;
                        this.loadedSources.push(id);
                        resolve({
                            src: src,
                            hashCode: id,
                            loaded: true,
                            status: 'Loaded'
                        });
                    }
                };
            } else {
                // Others
                this.loadedSources.push(id);
                script.onload = () => {
                    resolve({
                        src: src,
                        hashCode: id,
                        loaded: true,
                        status: 'Loaded'
                    });
                };
            }
            script.onerror = (error: any) => {
                reject({
                    src: src,
                    hashCode: id,
                    loaded: false,
                    status: 'Loaded'
                });
            };
            document.getElementsByTagName('head')[0].appendChild(script);
        });
    }

    loadScripts(sources: string[]) {
        return Promise.all(
            sources.map(src => {
                return this.loadScript(src);
            })
        );
    }
}
