import { TestBed, async, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AssetsLoader } from './assets-loader';
import { hashCode } from './helpers';
import { Subject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

describe('assets-loader', () => {
    let assetsLoader: AssetsLoader;
    const mockScript: {
        onload: () => void;
        onerror: (error: string | Event) => void;
    } = { onload: null, onerror: null };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: []
        });
        assetsLoader = TestBed.get(AssetsLoader);
    });

    describe('loadScript', () => {
        it('should load script success', fakeAsync(() => {
            const src = 'assets/main.js';
            const createElementSpy = spyOn(document, 'createElement');
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

        it('should not load script which has been loaded', fakeAsync(() => {
            const src = 'assets/main.js';
            const createElementSpy = spyOn(document, 'createElement');
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
            const createElementSpy = spyOn(document, 'createElement');
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
        it('should load scripts success', () => {
            const src1 = 'assets/vendor.js';
            const src2 = 'assets/main.js';

            const loadScriptSpy = spyOn(assetsLoader, 'loadScript');
            const loadScriptObservable1 = new Subject();
            const loadScriptObservable2 = new Subject();
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
    });

    describe('loadManifest', () => {
        let httpClient: HttpClient;
        let httpTestingController: HttpTestingController;
        beforeEach(() => {
            httpClient = TestBed.get(HttpClient);
            httpTestingController = TestBed.get(HttpTestingController);
        });

        afterEach(() => {
            // After every test, assert that there are no more pending requests.
            httpTestingController.verify();
        });

        it('should load manifest success', async(() => {
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
        }));
    });

    describe('loadAppAssets', () => {
        const app1 = {
            name: 'app1',
            host: '.host-selector',
            selector: 'app1-root-container',
            routerPathPrefix: '/app1',
            hostClass: 'app1-host',
            preload: false,
            resourcePathPrefix: '/static/app1/',
            styles: ['styles/main.css'],
            scripts: ['vendor.js', 'main.js'],
            loadSerial: false,
            manifest: '',
            extra: {
                appName: '应用1'
            }
        };

        it('load assets success without manifest', () => {
            const loadScriptsAndStyles$ = new Subject();
            const loadScriptsAndStylesSpy = spyOn(assetsLoader, 'loadScriptsAndStyles');
            loadScriptsAndStylesSpy.and.returnValue(loadScriptsAndStyles$);

            const loadAssetsSpy = jasmine.createSpy('load assets spy');
            assetsLoader.loadAppAssets(app1).subscribe(loadAssetsSpy);

            expect(loadAssetsSpy).not.toHaveBeenCalled();
            expect(loadScriptsAndStylesSpy).toHaveBeenCalled();
            expect(loadScriptsAndStylesSpy).toHaveBeenCalledWith(
                ['/static/app1/vendor.js', '/static/app1/main.js'],
                ['/static/app1/styles/main.css'],
                app1.loadSerial
            );

            loadScriptsAndStyles$.next('load success');
            expect(loadAssetsSpy).toHaveBeenCalled();
            expect(loadAssetsSpy).toHaveBeenCalledWith('load success');
        });

        it('load assets success with manifest', () => {
            const loadScriptsAndStyles$ = new Subject();
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
                app1.loadSerial
            );

            loadScriptsAndStyles$.next('load success');
            expect(loadAssetsSpy).toHaveBeenCalled();
            expect(loadAssetsSpy).toHaveBeenCalledWith('load success');
        });
    });
});
