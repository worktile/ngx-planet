import { hashCode, isEmpty, coerceArray, getHTMLElement, getResourceFileName } from './helpers';

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
});
