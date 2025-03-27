import { Injectable } from '@angular/core';
import { hashCode, isEmpty, getResourceFileName, getExtName, isObject, getAssetsBasePath, getScriptsAndStylesAssets } from './helpers';
import { of, Observable, Observer, forkJoin, concat } from 'rxjs';
import { map, switchMap, concatAll } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { PlanetApplication, PlanetApplicationEntry } from './planet.class';
import { createSandbox } from './sandbox';
import { AssetsTagItem, LinkTagAttributes, ScriptTagAttributes } from './inner-types';

const STYLE_LINK_OR_SCRIPT_REG = /<[script|link].*?>/gi;
const LINK_OR_SRC_REG = /(src|href)=["'](.*?[\.js|\.css])["']/i;
const TAG_ATTRS_REG = /(type|defer|async|rel)((=["'].*?["'])|\s|\>)/gi;

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

    loadScript(scriptAsset: AssetsTagItem) {
        const { src, tagName, attributes: tagAttributes } = scriptAsset;
        const id = hashCode(src);
        if (this.loadedSources.includes(id)) {
            return of({
                src: src,
                hashCode: id,
                loaded: true,
                status: 'Loaded'
            });
        }
        return new Observable((observer: Observer<AssetsLoadResult>) => {
            let scriptOrLink: HTMLScriptElement | HTMLLinkElement;
            if (tagName === 'link') {
                const LinkAttributes = tagAttributes as LinkTagAttributes;
                const link = document.createElement('link');
                link.href = src;
                if (LinkAttributes.rel) {
                    link.rel = LinkAttributes.rel;
                }
                scriptOrLink = link;
            } else {
                const scriptAttributes = tagAttributes as ScriptTagAttributes;
                const script: HTMLScriptElement = document.createElement('script');
                script.type = scriptAttributes?.type || 'text/javascript';
                script.src = src;
                if (!scriptAttributes?.defer || scriptAttributes?.defer !== 'false') {
                    script.defer = true;
                }
                if (!scriptAttributes?.async && scriptAttributes?.async !== 'false') {
                    script.async = true;
                }
                scriptOrLink = script;
            }

            if (scriptOrLink['readyState']) {
                // IE
                scriptOrLink['onreadystatechange'] = () => {
                    if (scriptOrLink['readyState'] === 'loaded' || scriptOrLink['readyState'] === 'complete') {
                        scriptOrLink['onreadystatechange'] = null;
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
                scriptOrLink.onload = () => {
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
            scriptOrLink.onerror = error => {
                observer.error({
                    src: src,
                    hashCode: id,
                    loaded: false,
                    status: 'Error',
                    error: error
                });
                observer.complete();
            };
            if (tagName === 'link') {
                const head = document.getElementsByTagName('head')[0];
                head.appendChild(scriptOrLink);
            } else {
                document.body.appendChild(scriptOrLink);
            }
        });
    }

    loadScriptWithSandbox(app: string, src: string): Observable<AssetsLoadResult> {
        const id = hashCode(src);
        if (this.loadedSources.includes(id)) {
            return of({
                src: src,
                hashCode: id,
                loaded: true,
                status: 'Loaded'
            });
        }
        return new Observable((observer: Observer<AssetsLoadResult>) => {
            this.http.get(src, { responseType: 'text' }).subscribe(
                (code: string) => {
                    this.loadedSources.push(id);
                    const sandbox = createSandbox(app);
                    sandbox.execScript(code, src);
                    observer.next({
                        src: src,
                        hashCode: id,
                        loaded: true,
                        status: 'Loaded'
                    });
                    observer.complete();
                },
                error => {
                    observer.error({
                        src: src,
                        hashCode: id,
                        loaded: false,
                        status: 'Error',
                        error: error
                    });
                    observer.complete();
                }
            );
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
                    loaded: false,
                    status: 'Loaded',
                    error: error
                });
                observer.complete();
            };
            head.appendChild(link);
        });
    }

    loadScripts(
        sources: AssetsTagItem[],
        options: {
            app?: string;
            sandbox?: boolean;
            serial?: boolean;
        } = {
            serial: false,
            sandbox: false
        }
    ): Observable<AssetsLoadResult[]> {
        if (isEmpty(sources)) {
            return of(null);
        }
        const observables = sources.map(source => {
            // TODO: 暂时只支持Proxy沙箱
            if (options.sandbox && window.Proxy) {
                return this.loadScriptWithSandbox(options.app, source.src);
            } else {
                return this.loadScript(source);
            }
        });
        if (options.serial) {
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

    loadStyles(sources: AssetsTagItem[]): Observable<AssetsLoadResult[]> {
        if (isEmpty(sources)) {
            return of(null);
        }
        return forkJoin(
            sources.map(source => {
                return this.loadStyle(source.src);
            })
        );
    }

    loadScriptsAndStyles(
        scripts: AssetsTagItem[] = [],
        styles: AssetsTagItem[] = [],
        options?: {
            app?: string;
            sandbox?: boolean;
            serial?: boolean;
        }
    ) {
        return forkJoin([this.loadScripts(scripts, options), this.loadStyles(styles)]);
    }

    /**
     * <script type="module" src="http://127.0.0.1:3001/main.js" async defer></script>
     * => [`type="module"`, "async ", "defer>"] as attributeStrMatchArr
     * => { type: "module", async: "async", defer: "defer" } as attributes
     */
    parseTagAttributes(tag: string): Record<string, string> {
        const attributeStrMatchArr = tag.match(TAG_ATTRS_REG);
        if (attributeStrMatchArr) {
            const attributes: Record<string, string> = {};
            attributeStrMatchArr.forEach(item => {
                const equalSignIndex = item.indexOf('=');
                if (equalSignIndex > 0) {
                    // 'type="module"' => { type: "module" }
                    const key = item.slice(0, equalSignIndex);
                    attributes[key] = item.slice(equalSignIndex + 2, item.length - 1);
                } else {
                    // 'async ' => 'async'
                    // 'defer>' => 'defer'
                    const key = item.slice(0, item.length - 1);
                    attributes[key] = key;
                }
            });
            return attributes;
        }
        return undefined;
    }

    parseManifestFromHTML(html: string): Record<string, AssetsTagItem> {
        const result: Record<string, AssetsTagItem> = {};
        const matchResult = html.match(STYLE_LINK_OR_SCRIPT_REG);
        matchResult.forEach(item => {
            const isLinkTag = item.trim().toLowerCase().slice(1, item.indexOf(' ')) === 'link';
            const linkOrSrcResult = item.match(LINK_OR_SRC_REG);
            if (linkOrSrcResult && linkOrSrcResult[2]) {
                const src = linkOrSrcResult[2];
                const hashName = getResourceFileName(src);
                let barSplitIndex = hashName.indexOf('-');
                let dotSplitIndex = hashName.indexOf('.');
                const splitIndex = barSplitIndex > -1 ? barSplitIndex : dotSplitIndex;
                if (splitIndex > -1) {
                    const name = hashName.slice(0, splitIndex);
                    const ext = getExtName(hashName);
                    const assetsTag: AssetsTagItem = {
                        src: src,
                        tagName: isLinkTag ? 'link' : 'script'
                    };
                    result[ext ? `${name}.${ext}` : name] = assetsTag;

                    const attributes = this.parseTagAttributes(item);
                    if (attributes) {
                        assetsTag.attributes = attributes;
                    }
                    // const typeTagResult = item.match(TAG_TYPE_REG);
                    // if (typeTagResult && typeTagResult[1]) {
                    //     assetsTag.attributes = {
                    //         type: typeTagResult[1]
                    //     };
                    // }
                }
            }
        });
        return result;
    }

    loadAppAssets(app: PlanetApplication) {
        const basePath = getAssetsBasePath(app);
        const manifest = app.entry ? (isObject<PlanetApplicationEntry>(app.entry) ? app.entry.manifest : app.entry) : app.manifest;
        if (manifest) {
            const manifestExt = getExtName(manifest);
            const isHtml = manifestExt === 'html';
            const responseType = isHtml ? 'text' : 'json';
            return this.loadManifest(`${manifest}?t=${new Date().getTime()}`, responseType).pipe(
                switchMap(manifestResult => {
                    const { scripts, styles } = getScriptsAndStylesAssets(app, basePath, manifestResult);
                    return this.loadScriptsAndStyles(scripts, styles, {
                        app: app.name,
                        sandbox: app.sandbox,
                        serial: app.loadSerial
                    });
                })
            );
        } else {
            const { scripts, styles } = getScriptsAndStylesAssets(app, basePath);
            return this.loadScriptsAndStyles(scripts, styles, {
                app: app.name,
                sandbox: app.sandbox,
                serial: app.loadSerial
            });
        }
    }

    loadManifest(url: string, responseType: 'text' | 'json' = 'json'): Observable<Record<string, AssetsTagItem>> {
        return this.http
            .get(url, {
                responseType: responseType as 'json'
            })
            .pipe(
                map((response: any) => {
                    if (responseType === 'text') {
                        return this.parseManifestFromHTML(response as string);
                    } else {
                        const result: Record<string, AssetsTagItem> = {};
                        Object.keys(response).forEach(key => {
                            result[key] = {
                                src: response[key]
                            };
                        });
                        return result;
                    }
                })
            );
    }
}
