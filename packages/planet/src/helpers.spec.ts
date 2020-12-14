import {
    hashCode,
    isEmpty,
    coerceArray,
    getHTMLElement,
    getResourceFileName,
    buildResourceFilePath,
    getScriptsAndStylesFullPaths,
    getTagNameByTemplate,
    createElementByTemplate
} from './helpers';

describe('helpers', () => {
    describe('hashCode', () => {
        it(`should get number hash code`, () => {
            const result = hashCode('/scripts/main.js');
            expect(result).toBeTruthy();
            expect(typeof result === 'number').toBeTruthy();
            expect(/\d{9}/.test(result.toString())).toBeTruthy();
        });

        it(`should get same hash code when input is same`, () => {
            const result1 = hashCode('/scripts/main.js');
            const result2 = hashCode('/scripts/main.js');
            expect(result1).toEqual(result2);
        });

        it(`should get different hash code when input is different`, () => {
            const result1 = hashCode('/scripts/main.js');
            const result2 = hashCode('/scripts/main1.js');
            expect(result1).not.toEqual(result2);
        });
    });

    describe(`isEmpty`, () => {
        it(`should is empty when value is undefined`, () => {
            const result = isEmpty(undefined);
            expect(result).toBe(true);
        });

        it(`should is empty when value is null`, () => {
            const result = isEmpty(null);
            expect(result).toBe(true);
        });

        it(`should is empty when value is 0`, () => {
            const result = isEmpty(0);
            expect(result).toBe(true);
        });

        it(`should is empty when value is false`, () => {
            const result = isEmpty(false);
            expect(result).toBe(true);
        });

        it(`should is not empty when value is true`, () => {
            const result = isEmpty(true);
            expect(result).toBe(false);
        });

        it(`should is empty when value is empty array`, () => {
            const result = isEmpty([]);
            expect(result).toBe(true);
        });

        it(`should is not empty when value is not empty array`, () => {
            const result = isEmpty([1]);
            expect(result).toBe(false);
        });

        it(`should is not empty when value is number`, () => {
            const result = isEmpty(1);
            expect(result).toBe(false);
        });

        it(`should is not empty when value is object`, () => {
            const result = isEmpty({});
            expect(result).toBe(false);
        });
    });

    describe('coerceArray', () => {
        it('should wrap a string in an array', () => {
            const stringVal = 'just a string';
            expect(coerceArray(stringVal)).toEqual([stringVal]);
        });

        it('should wrap a number in an array', () => {
            const numberVal = 42;
            expect(coerceArray(numberVal)).toEqual([numberVal]);
        });

        it('should wrap an object in an array', () => {
            const objectVal = { something: 'clever' };
            expect(coerceArray(objectVal)).toEqual([objectVal]);
        });

        it('should wrap a null value in an array', () => {
            const nullVal = null;
            expect(coerceArray(nullVal)).toEqual([nullVal]);
        });

        it('should wrap an undefined value in an array', () => {
            const undefinedVal = undefined;
            expect(coerceArray(undefinedVal)).toEqual([undefinedVal]);
        });

        it('should not wrap an array in an array', () => {
            const arrayVal = [1, 2, 3];
            expect(coerceArray(arrayVal)).toBe(arrayVal);
        });
    });

    describe('getHTMLElement', () => {
        it('should get HTMLElement when input is HTMLElement', () => {
            const htmlElement = document.createElement('div');
            const result = getHTMLElement(htmlElement);
            expect(result).toBe(htmlElement);
        });

        it('should call document querySelector when input is not HTMLElement', () => {
            const querySelectorSpy = spyOn(document, 'querySelector');
            expect(querySelectorSpy).toHaveBeenCalledTimes(0);
            getHTMLElement('.span');
            expect(querySelectorSpy).toHaveBeenCalledTimes(1);
            expect(querySelectorSpy).toHaveBeenCalledWith('.span');
        });
    });

    describe(`createElementByTemplate`, () => {
        it('should create html element success', () => {
            const element = createElementByTemplate(`<app1-root class='app1-root'></app1-root>`);
            expect(element.outerHTML).toBe(`<app1-root class="app1-root"></app1-root>`);
        });

        it('should create html element when template invalid', () => {
            expect(() => {
                createElementByTemplate(`app1-root`);
            }).toThrowError(`invalid template 'app1-root'`);
        });

        it('should create html element when template is empty', () => {
            const element = createElementByTemplate(``);
            expect(element).toBe(null);
        });
    });

    describe(`getTagNameByTemplate`, () => {
        it('should get tagName is APP1-ROOT', () => {
            const tagName = getTagNameByTemplate(`<app1-root></app1-root>`);
            expect(tagName).toBe('APP1-ROOT');
        });

        it('should get tagName when template is empty', () => {
            const tagName = getTagNameByTemplate(``);
            expect(tagName).toBe(null);
        });
    });

    describe('getResourceFileName', () => {
        it('should get original path when path is "file.js"', () => {
            const path = 'file.js';
            const result = getResourceFileName(path);
            expect(result).toBe(path);
        });

        it('should get correct path when path is "assets/file.js"', () => {
            const path = 'assets/file.js';
            const result = getResourceFileName(path);
            expect(result).toBe('file.js');
        });
    });

    describe('buildResourceFilePath', () => {
        it('should get correct path input "main.js"', () => {
            const result = buildResourceFilePath('main.js', { 'main.js': 'main.h2d3f2232.js' });
            expect(result).toBe('main.h2d3f2232.js');
        });

        it('should get correct path when input "main.js" which has not exist in manifest', () => {
            const result = buildResourceFilePath('main.js', {});
            expect(result).toBe('main.js');
        });

        it('should get correct path input "assets/scripts/main.js"', () => {
            const result = buildResourceFilePath('assets/scripts/main.js', { 'main.js': 'main.h2d3f2232.js' });
            expect(result).toBe('assets/scripts/main.h2d3f2232.js');
        });
    });

    describe('getScriptsAndStylesFullPaths', () => {
        const app = {
            name: 'app1',
            hostParent: '.host-selector',
            selector: 'app1-root',
            routerPathPrefix: '/app1',
            hostClass: 'app1-host',
            preload: false,
            // resourcePathPrefix: '/static/app1/',
            styles: ['styles/main.css'],
            scripts: ['vendor.js', 'main.js'],
            extra: {
                appName: '应用1'
            }
        };

        it('should get correct full path without resourcePathPrefix', () => {
            const result = getScriptsAndStylesFullPaths({ ...app });
            expect(result).toEqual({
                scripts: ['vendor.js', 'main.js'],
                styles: ['styles/main.css']
            });
        });

        it('should get correct full path with resourcePathPrefix', () => {
            const result = getScriptsAndStylesFullPaths({ ...app, resourcePathPrefix: '/static/app1/' });
            expect(result).toEqual({
                scripts: ['/static/app1/vendor.js', '/static/app1/main.js'],
                styles: ['/static/app1/styles/main.css']
            });
        });

        it('should get correct full path with manifest', () => {
            const manifest = {
                'vendor.js': `vendor.${randomString()}.js`,
                'main.js': `main.${randomString()}.js`,
                'main.css': `main.${randomString()}.css`
            };
            const result = getScriptsAndStylesFullPaths({ ...app, resourcePathPrefix: '/static/app1/' }, manifest);
            expect(result).toEqual({
                scripts: [`/static/app1/${manifest['vendor.js']}`, `/static/app1/${manifest['main.js']}`],
                styles: [`/static/app1/styles/${manifest['main.css']}`]
            });
        });
    });
});

function randomString() {
    return Math.random()
        .toString(36)
        .slice(-8);
}
