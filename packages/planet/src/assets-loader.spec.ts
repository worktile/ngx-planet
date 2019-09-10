import { TestBed, async, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AssetsLoader } from './assets-loader';
import { hashCode } from './helpers';
import { Subject } from 'rxjs';

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
});
