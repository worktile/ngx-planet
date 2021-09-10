import { TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AssetsLoader, AssetsLoadResult } from './assets-loader';
import { hashCode } from './helpers';
import { Subject, of, observable, Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

describe('assets-loader', () => {
    let assetsLoader: AssetsLoader;
    const mockScript: {
        onload: () => void;
        onerror: (error: string | Event) => void;
    } = { onload: () => {}, onerror: null };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: []
        });
        assetsLoader = TestBed.inject(AssetsLoader);
    });

    describe('loadScript', () => {
        it('should load script success when not in IE', fakeAsync(() => {
            const src = 'assets/main.js';
            const createElementSpy: jasmine.Spy = spyOn(document, 'createElement');
            const appendChildSpy = spyOn(document.body, 'appendChild');

            // 返回 mock script
            createElementSpy.and.returnValue(mockScript);
            // 没有调用
            expect(appendChildSpy).not.toHaveBeenCalled();
            expect(createElementSpy).not.toHaveBeenCalled();

            const scriptLoaded = jasmine.createSpy('load script');
            assetsLoader.loadScript(src).subscribe(scriptLoaded, error => {
                console.error(error);
            });
            // 已经被调用
            expect(appendChildSpy).toHaveBeenCalledTimes(1);
            expect(createElementSpy).toHaveBeenCalledTimes(1);

            // scriptLoaded 没有加载完毕
            expect(scriptLoaded).toHaveBeenCalledTimes(0);

            // 手动调用使其加载完毕
            mockScript.onload();

            // // scriptLoaded 加载完毕
            expect(scriptLoaded).toHaveBeenCalledTimes(1);
            expect(scriptLoaded).toHaveBeenCalledWith({
                src: src,
                hashCode: hashCode(src),
                loaded: true,
                status: 'Loaded'
            });
        }));

        it('should load script success when in IE and readyState is loaded', fakeAsync(() => {
            const mockScriptInIE: { readyState: string; onreadystatechange: () => void } = {
                readyState: 'uninitialized',
                onreadystatechange: () => {
                    console.log('loaded script state change');
                }
            };
            const src = 'assets/main.js';
            const createElementSpy: jasmine.Spy = spyOn(document, 'createElement');
            const appendChildSpy = spyOn(document.body, 'appendChild');

            // 返回 mock script
            createElementSpy.and.returnValue(mockScriptInIE);
            // 没有调用
            expect(appendChildSpy).not.toHaveBeenCalled();
            expect(createElementSpy).not.toHaveBeenCalled();

            const scriptLoaded = jasmine.createSpy('load script');
            assetsLoader.loadScript(src).subscribe(scriptLoaded, error => {
                console.error(error);
            });
            // 已经被调用
            expect(appendChildSpy).toHaveBeenCalledTimes(1);
            expect(createElementSpy).toHaveBeenCalledTimes(1);

            // scriptLoaded 没有加载完毕
            expect(scriptLoaded).toHaveBeenCalledTimes(0);

            // 手动调用使其加载完毕
            mockScriptInIE.readyState = 'loaded';
            mockScriptInIE.onreadystatechange();

            // // scriptLoaded 加载完毕
            expect(scriptLoaded).toHaveBeenCalledTimes(1);
            expect(mockScriptInIE.onreadystatechange).toBeNull();
            expect(scriptLoaded).toHaveBeenCalledWith({
                src: src,
                hashCode: hashCode(src),
                loaded: true,
                status: 'Loaded'
            });
        }));

        it('should load script success when in IE and readyState is complete or loaded', fakeAsync(() => {
            const mockScriptInIE: { readyState: string; onreadystatechange: () => void } = {
                readyState: 'uninitialized',
                onreadystatechange: () => {
                    console.log('loaded script state change');
                }
            };
            const src = 'assets/main.js';
            const createElementSpy: jasmine.Spy = spyOn(document, 'createElement');
            const appendChildSpy = spyOn(document.body, 'appendChild');

            // 返回 mock script
            createElementSpy.and.returnValue(mockScriptInIE);
            // 没有调用
            expect(appendChildSpy).not.toHaveBeenCalled();
            expect(createElementSpy).not.toHaveBeenCalled();

            const scriptLoaded = jasmine.createSpy('load script');
            assetsLoader.loadScript(src).subscribe(scriptLoaded, error => {
                console.error(error);
            });
            // 已经被调用
            expect(appendChildSpy).toHaveBeenCalledTimes(1);
            expect(createElementSpy).toHaveBeenCalledTimes(1);

            // scriptLoaded 没有加载完毕
            expect(scriptLoaded).toHaveBeenCalledTimes(0);

            // 手动调用使其加载完毕
            mockScriptInIE.readyState = 'complete';
            mockScriptInIE.onreadystatechange();

            // // scriptLoaded 加载完毕
            expect(scriptLoaded).toHaveBeenCalledTimes(1);
            expect(mockScriptInIE.onreadystatechange).toBeNull();
            expect(scriptLoaded).toHaveBeenCalledWith({
                src: src,
                hashCode: hashCode(src),
                loaded: true,
                status: 'Loaded'
            });
        }));

        it('should load script success when in IE and readyState is not complete or loaded', fakeAsync(() => {
            const mockScriptInIE: { readyState: string; onreadystatechange: () => void } = {
                readyState: 'uninitialized',
                onreadystatechange: () => {
                    console.log('loaded script state change');
                }
            };
            const src = 'assets/main.js';
            const createElementSpy: jasmine.Spy = spyOn(document, 'createElement');
            const appendChildSpy = spyOn(document.body, 'appendChild');

            // 返回 mock script
            createElementSpy.and.returnValue(mockScriptInIE);
            // 没有调用
            expect(appendChildSpy).not.toHaveBeenCalled();
            expect(createElementSpy).not.toHaveBeenCalled();

            const scriptLoaded = jasmine.createSpy('load script');
            assetsLoader.loadScript(src).subscribe(scriptLoaded, error => {
                console.error(error);
            });
            // 已经被调用
            expect(appendChildSpy).toHaveBeenCalledTimes(1);
            expect(createElementSpy).toHaveBeenCalledTimes(1);

            // scriptLoaded 没有加载完毕
            expect(scriptLoaded).toHaveBeenCalledTimes(0);

            // 手动调用使其加载完毕
            mockScriptInIE.readyState = 'any status';
            mockScriptInIE.onreadystatechange();

            // // scriptLoaded 加载完毕
            expect(scriptLoaded).not.toHaveBeenCalled();
            expect(mockScriptInIE.onreadystatechange).not.toBeNull();
        }));

        it('should not load script which has been loaded', fakeAsync(() => {
            const src = 'assets/main.js';
            const createElementSpy: jasmine.Spy = spyOn(document, 'createElement');
            const appendChildSpy = spyOn(document.body, 'appendChild');

            createElementSpy.and.returnValue(mockScript);

            const scriptLoaded = jasmine.createSpy('load script');
            assetsLoader.loadScript(src).subscribe(scriptLoaded, error => {
                console.error(error);
            });
            mockScript.onload();

            const scriptLoaded2 = jasmine.createSpy('load script');
            assetsLoader.loadScript(src).subscribe(scriptLoaded2, error => {
                console.error(error);
            });
            expect(appendChildSpy).toHaveBeenCalledTimes(1);
            expect(createElementSpy).toHaveBeenCalledTimes(1);
            expect(scriptLoaded2).toHaveBeenCalledTimes(1);
            expect(scriptLoaded2).toHaveBeenCalledWith({
                src: src,
                hashCode: hashCode(src),
                loaded: true,
                status: 'Loaded'
            });
        }));

        it('should get error when load script fail', fakeAsync(() => {
            const src = 'assets/main.js';
            const createElementSpy: jasmine.Spy = spyOn(document, 'createElement');
            const appendChildSpy = spyOn(document.body, 'appendChild');

            // 返回 mock script
            createElementSpy.and.returnValue(mockScript);
            // 没有调用
            expect(appendChildSpy).not.toHaveBeenCalled();
            expect(createElementSpy).not.toHaveBeenCalled();

            const scriptLoaded = jasmine.createSpy('load script');
            const scriptLoadedError = jasmine.createSpy('load script error');
            assetsLoader.loadScript(src).subscribe(scriptLoaded, scriptLoadedError);

            // 已经被调用
            expect(appendChildSpy).toHaveBeenCalledTimes(1);
            expect(createElementSpy).toHaveBeenCalledTimes(1);

            // scriptLoaded 没有加载完毕
            expect(scriptLoaded).not.toHaveBeenCalled();

            // 手动调用使其加载完毕
            mockScript.onerror('load js error');

            expect(scriptLoaded).not.toHaveBeenCalled();

            expect(scriptLoadedError).toHaveBeenCalled();
            expect(scriptLoadedError).toHaveBeenCalledWith({
                src: src,
                hashCode: hashCode(src),
                loaded: false,
                status: 'Error',
                error: 'load js error'
            });
        }));
    });

    describe('loadScripts', () => {
        it('should return null when sources is []', fakeAsync(() => {
            const loadScriptSpy = spyOn(assetsLoader, 'loadScript');

            expect(loadScriptSpy).not.toHaveBeenCalled();

            const loadedScripts = jasmine.createSpy('loaded scripts success');
            const loadedScriptsFail = jasmine.createSpy('loaded scripts fail');
            assetsLoader.loadStyles([]).subscribe(loadedScripts, loadedScriptsFail);

            expect(loadScriptSpy).not.toHaveBeenCalled();
            expect(loadedScripts).toHaveBeenCalledTimes(1);
            expect(loadedScripts).toHaveBeenCalledWith(null);
            expect(loadedScriptsFail).not.toHaveBeenCalled();
        }));

        it('should return null when sources is null', fakeAsync(() => {
            const loadScriptSpy = spyOn(assetsLoader, 'loadScript');

            expect(loadScriptSpy).not.toHaveBeenCalled();

            const loadedScripts = jasmine.createSpy('loaded scripts success');
            const loadedScriptsFail = jasmine.createSpy('loaded scripts fail');
            assetsLoader.loadStyles(null).subscribe(loadedScripts, loadedScriptsFail);

            expect(loadScriptSpy).not.toHaveBeenCalled();
            expect(loadedScripts).toHaveBeenCalledTimes(1);
            expect(loadedScripts).toHaveBeenCalledWith(null);
            expect(loadedScriptsFail).not.toHaveBeenCalled();
        }));

        it('should load scripts success', () => {
            const src1 = 'assets/vendor.js';
            const src2 = 'assets/main.js';

            const loadScriptSpy = spyOn(assetsLoader, 'loadScript');
            const loadScriptObservable1 = new Subject<AssetsLoadResult>();
            const loadScriptObservable2 = new Subject<AssetsLoadResult>();
            loadScriptSpy.and.returnValues(loadScriptObservable1, loadScriptObservable2);

            const result1 = {
                src: src1,
                hashCode: hashCode(src1),
                loaded: true,
                status: 'Loaded'
            };
            const result2 = {
                src: src2,
                hashCode: hashCode(src2),
                loaded: true,
                status: 'Loaded'
            };

            const loadScriptsSpy = jasmine.createSpy('load scripts spy');
            assetsLoader.loadScripts([src1, src2]).subscribe(loadScriptsSpy);

            loadScriptObservable2.next(result2);
            loadScriptObservable2.complete();
            loadScriptObservable1.next(result1);
            loadScriptObservable1.complete();

            expect(loadScriptsSpy).toHaveBeenCalled();
            expect(loadScriptsSpy).toHaveBeenCalledWith([result1, result2]);
        });

        it('should load scripts success when serial is true', () => {
            const src1 = 'assets/vendor.js';
            const src2 = 'assets/main.js';

            const loadScriptSpy = spyOn(assetsLoader, 'loadScript');
            const loadScriptObservable1 = new Subject<AssetsLoadResult>();
            const loadScriptObservable2 = new Subject<AssetsLoadResult>();
            loadScriptSpy.and.returnValues(loadScriptObservable1, loadScriptObservable2);

            const result1 = {
                src: src1,
                hashCode: hashCode(src1),
                loaded: true,
                status: 'Loaded'
            };
            const result2 = {
                src: src2,
                hashCode: hashCode(src2),
                loaded: true,
                status: 'Loaded'
            };

            const loadScriptsSpy = jasmine.createSpy('load scripts spy');
            assetsLoader.loadScripts([src1, src2], { serial: true }).subscribe(loadScriptsSpy);

            loadScriptObservable1.next(result1);
            loadScriptObservable1.complete();
            loadScriptObservable2.next(result2);
            loadScriptObservable2.complete();

            expect(loadScriptsSpy).toHaveBeenCalled();
            expect(loadScriptsSpy.calls.count()).toEqual(2);
            expect(loadScriptsSpy.calls.argsFor(0)).toEqual([[result1]]);
            expect(loadScriptsSpy.calls.argsFor(1)).toEqual([[result2]]);
        });
    });

    describe('loadManifest', () => {
        let httpClient: HttpClient;
        let httpTestingController: HttpTestingController;
        beforeEach(() => {
            httpClient = TestBed.inject(HttpClient);
            httpTestingController = TestBed.inject(HttpTestingController);
        });

        afterEach(() => {
            // After every test, assert that there are no more pending requests.
            httpTestingController.verify();
        });

        it(
            'should load manifest success',
            waitForAsync(() => {
                const testData = {
                    'main.js': 'main1.js'
                };
                const loadManifestSpy = jasmine.createSpy('load manifest spy');
                assetsLoader.loadManifest('/static/assets/manifest.json').subscribe(loadManifestSpy);
                const req = httpTestingController.expectOne('/static/assets/manifest.json');

                // Assert that the request is a GET.
                expect(req.request.method).toEqual('GET');
                expect(loadManifestSpy).not.toHaveBeenCalled();

                // Respond with mock data, causing Observable to resolve.
                // Subscribe callback asserts that correct data was returned.
                req.flush(testData);

                expect(loadManifestSpy).toHaveBeenCalled();
                expect(loadManifestSpy).toHaveBeenCalledWith(testData);
            })
        );
    });

    describe('loadAppAssets', () => {
        const app1 = {
            name: 'app1',
            hostParent: '.host-selector',
            selector: 'app1-root',
            routerPathPrefix: '/app1',
            hostClass: 'app1-host',
            preload: false,
            resourcePathPrefix: '/static/app1/',
            styles: ['styles/main.css'],
            scripts: ['vendor.js', 'main.js'],
            sandbox: false,
            loadSerial: false,
            manifest: '',
            extra: {
                appName: '应用1'
            }
        };

        it('load assets success without manifest', () => {
            const loadScriptsAndStyles$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();
            const loadScriptsAndStylesSpy = spyOn(assetsLoader, 'loadScriptsAndStyles');
            loadScriptsAndStylesSpy.and.returnValue(loadScriptsAndStyles$);

            const loadAssetsSpy = jasmine.createSpy('load assets spy');
            assetsLoader.loadAppAssets(app1).subscribe(loadAssetsSpy);

            expect(loadAssetsSpy).not.toHaveBeenCalled();
            expect(loadScriptsAndStylesSpy).toHaveBeenCalled();
            expect(loadScriptsAndStylesSpy).toHaveBeenCalledWith(
                ['/static/app1/vendor.js', '/static/app1/main.js'],
                ['/static/app1/styles/main.css'],
                {
                    app: 'app1',
                    sandbox: false,
                    serial: app1.loadSerial
                }
            );

            loadScriptsAndStyles$.next('load success' as any);
            expect(loadAssetsSpy).toHaveBeenCalled();
            expect(loadAssetsSpy).toHaveBeenCalledWith('load success');
        });

        it('load assets success with manifest', () => {
            const loadScriptsAndStyles$ = new Subject<[AssetsLoadResult[], AssetsLoadResult[]]>();
            const loadScriptsAndStylesSpy = spyOn(assetsLoader, 'loadScriptsAndStyles');
            loadScriptsAndStylesSpy.and.returnValue(loadScriptsAndStyles$);

            const loadManifestSpy = spyOn(assetsLoader, 'loadManifest');
            const manifestResult = {
                'main.js': 'main.123455.js',
                'vendor.js': 'vendor.23221.js',
                'main.css': 'main.s1223.css'
            };
            loadManifestSpy.and.returnValue(of(manifestResult));

            const loadAssetsSpy = jasmine.createSpy('load assets spy');
            assetsLoader
                .loadAppAssets({
                    ...app1,
                    manifest: '/app1/manifest.json'
                })
                .subscribe(loadAssetsSpy);

            expect(loadAssetsSpy).not.toHaveBeenCalled();
            expect(loadScriptsAndStylesSpy).toHaveBeenCalled();
            expect(loadScriptsAndStylesSpy).toHaveBeenCalledWith(
                [`/static/app1/${manifestResult['vendor.js']}`, `/static/app1/${manifestResult['main.js']}`],
                [`/static/app1/styles/${manifestResult['main.css']}`],
                {
                    app: 'app1',
                    sandbox: false,
                    serial: app1.loadSerial
                }
            );

            loadScriptsAndStyles$.next('load success' as any);
            expect(loadAssetsSpy).toHaveBeenCalled();
            expect(loadAssetsSpy).toHaveBeenCalledWith('load success');
        });
    });

    describe('loadStyle', () => {
        let src, createElementSpy, getElementsByTagNameSpy, appendChildSpy, styleLoaded, styleLoadedFail;
        const heads: { appendChild: () => void }[] = [{ appendChild: null }];
        beforeEach(() => {
            src = 'css/style.css';
            createElementSpy = spyOn(document, 'createElement');
            getElementsByTagNameSpy = spyOn(document, 'getElementsByTagName');

            createElementSpy.and.returnValue(mockScript);
            getElementsByTagNameSpy.and.returnValue(heads);

            expect(createElementSpy).not.toHaveBeenCalled();
            expect(getElementsByTagNameSpy).not.toHaveBeenCalled();
            appendChildSpy = spyOn(heads[0], 'appendChild');
            expect(appendChildSpy).not.toHaveBeenCalled();

            styleLoaded = jasmine.createSpy('style loaded');
            styleLoadedFail = jasmine.createSpy('load style error');
            assetsLoader.loadStyle(src).subscribe(styleLoaded, styleLoadedFail);

            expect(createElementSpy).toHaveBeenCalledTimes(1);
            expect(getElementsByTagNameSpy).toHaveBeenCalledTimes(1);
            expect(appendChildSpy).toHaveBeenCalledTimes(1);
            expect(styleLoaded).toHaveBeenCalledTimes(0);
        });

        it('should load style success', fakeAsync(() => {
            mockScript.onload();

            expect(styleLoaded).toHaveBeenCalledTimes(1);
            expect(styleLoadedFail).toHaveBeenCalledTimes(0);
            expect(styleLoaded).toHaveBeenCalledWith({
                src: src,
                hashCode: hashCode(src),
                loaded: true,
                status: 'Loaded'
            });
        }));

        it('should not load style when style has been loaded', fakeAsync(() => {
            mockScript.onload();

            const styleLoaded2 = jasmine.createSpy('load style');
            assetsLoader.loadStyle(src).subscribe(styleLoaded2, error => {
                console.error(error);
            });
            expect(createElementSpy).toHaveBeenCalledTimes(1);
            expect(getElementsByTagNameSpy).toHaveBeenCalledTimes(1);

            expect(styleLoaded2).toHaveBeenCalledWith({
                src: src,
                hashCode: hashCode(src),
                loaded: true,
                status: 'Loaded'
            });
        }));

        it('should get error when load style fail', fakeAsync(() => {
            mockScript.onerror('load style error');

            expect(styleLoaded).toHaveBeenCalledTimes(0);
            expect(styleLoadedFail).toHaveBeenCalledTimes(1);
            expect(styleLoadedFail).toHaveBeenCalledWith({
                src: src,
                hashCode: hashCode(src),
                loaded: true,
                status: 'Loaded',
                error: 'load style error'
            });
        }));
    });

    describe('loadStyles', () => {
        it('should return null when sources is empty', fakeAsync(() => {
            const loadStyletSpy = spyOn(assetsLoader, 'loadStyle');

            expect(loadStyletSpy).not.toHaveBeenCalled();

            const loadedStyles = jasmine.createSpy('loaded styles success');
            const loadedStylesFail = jasmine.createSpy('loaded styles fail');
            assetsLoader.loadStyles([]).subscribe(loadedStyles, loadedStylesFail);

            expect(loadStyletSpy).not.toHaveBeenCalled();
            expect(loadedStyles).toHaveBeenCalledTimes(1);
            expect(loadedStyles).toHaveBeenCalledWith(null);
        }));

        it('should return load styles', fakeAsync(() => {
            const stylesSrc = ['css/style1.css', 'css/style2.css'];
            const loadStyletSpy = spyOn(assetsLoader, 'loadStyle');

            expect(loadStyletSpy).not.toHaveBeenCalled();

            const loadStyleObservable1: Subject<AssetsLoadResult> = new Subject<AssetsLoadResult>();
            const loadStyleObservable2: Subject<AssetsLoadResult> = new Subject<AssetsLoadResult>();

            const loadStyleObservable1Value = {
                src: stylesSrc[0],
                hashCode: hashCode(stylesSrc[0]),
                loaded: true,
                status: 'Loaded'
            };
            const loadStyleObservable2Value = {
                src: stylesSrc[1],
                hashCode: hashCode(stylesSrc[1]),
                loaded: true,
                status: 'Loaded'
            };

            loadStyletSpy.and.returnValues(loadStyleObservable1, loadStyleObservable2);

            const loadedStyles = jasmine.createSpy('loaded styles success');
            const loadedStylesFail = jasmine.createSpy('loaded styles fail');
            assetsLoader.loadStyles(stylesSrc).subscribe(loadedStyles, loadedStylesFail);

            expect(loadStyletSpy).toHaveBeenCalledTimes(2);
            expect(loadedStyles).not.toHaveBeenCalled();

            loadStyleObservable1.next(loadStyleObservable1Value);
            loadStyleObservable1.complete();
            loadStyleObservable2.next(loadStyleObservable2Value);
            loadStyleObservable2.complete();

            expect(loadedStyles).toHaveBeenCalledTimes(1);
            expect(loadedStyles).toHaveBeenCalledWith([loadStyleObservable1Value, loadStyleObservable2Value]);
        }));
    });

    describe('loadScriptsAndStyles', () => {
        it('should load scripts and styles success', fakeAsync(() => {
            const scripts = ['assert/main.js', 'assert/main1.js'];
            const styles = ['css/style.css', 'css/style1.css'];
            const loadScriptsSpy = spyOn(assetsLoader, 'loadScripts');
            const loadStylesSpy = spyOn(assetsLoader, 'loadStyles');
            const loadScriptsObservable = new Subject<AssetsLoadResult[]>();
            const loadStylesObservable = new Subject<AssetsLoadResult[]>();
            const loadScriptsValues = [
                {
                    src: scripts[0],
                    hashCode: hashCode(scripts[0]),
                    loaded: true,
                    status: 'Loaded'
                },
                {
                    src: scripts[1],
                    hashCode: hashCode(scripts[1]),
                    loaded: true,
                    status: 'Loaded'
                }
            ];
            const loadStylesValues = [
                {
                    src: styles[0],
                    hashCode: hashCode(styles[0]),
                    loaded: true,
                    status: 'Loaded'
                },
                {
                    src: styles[1],
                    hashCode: hashCode(styles[1]),
                    loaded: true,
                    status: 'Loaded'
                }
            ];

            loadScriptsSpy.and.returnValue(loadScriptsObservable);
            loadStylesSpy.and.returnValue(loadStylesObservable);

            expect(loadScriptsSpy).not.toHaveBeenCalled();
            expect(loadStylesSpy).not.toHaveBeenCalled();

            const loadedSuccess = jasmine.createSpy('loaded scripts and styles success');
            const loadedFail = jasmine.createSpy('loaded scripts and styles fail');
            assetsLoader.loadScriptsAndStyles(scripts, styles).subscribe(loadedSuccess, loadedFail);

            expect(loadScriptsSpy).toHaveBeenCalledTimes(1);
            expect(loadStylesSpy).toHaveBeenCalledTimes(1);
            expect(loadedSuccess).not.toHaveBeenCalled();

            loadScriptsObservable.next(loadScriptsValues);
            loadScriptsObservable.complete();
            loadStylesObservable.next(loadStylesValues);
            loadStylesObservable.complete();

            expect(loadedSuccess).toHaveBeenCalledTimes(1);
            expect(loadedSuccess).toHaveBeenCalledWith([loadScriptsValues, loadStylesValues]);
        }));

        it('should return null when scripts and styles is []', fakeAsync(() => {
            const scripts = [];
            const styles = [];
            const loadScriptsSpy = spyOn(assetsLoader, 'loadScripts');
            const loadStylesSpy = spyOn(assetsLoader, 'loadStyles');
            const loadScriptsObservable = new Subject<AssetsLoadResult[]>();
            const loadStylesObservable = new Subject<AssetsLoadResult[]>();

            loadScriptsSpy.and.returnValue(loadScriptsObservable);
            loadStylesSpy.and.returnValue(loadStylesObservable);

            expect(loadScriptsSpy).not.toHaveBeenCalled();
            expect(loadStylesSpy).not.toHaveBeenCalled();

            const loadedSuccess = jasmine.createSpy('loaded scripts and styles success');
            const loadedFail = jasmine.createSpy('loaded scripts and styles fail');
            assetsLoader.loadScriptsAndStyles(scripts, styles).subscribe(loadedSuccess, loadedFail);

            expect(loadScriptsSpy).toHaveBeenCalledTimes(1);
            expect(loadStylesSpy).toHaveBeenCalledTimes(1);
            expect(loadedSuccess).not.toHaveBeenCalled();

            loadScriptsObservable.next(null);
            loadScriptsObservable.complete();
            loadStylesObservable.next(null);
            loadStylesObservable.complete();

            expect(loadedSuccess).toHaveBeenCalledTimes(1);
            expect(loadedSuccess).toHaveBeenCalledWith([null, null]);
        }));
    });
});
