import { GlobalEventDispatcher } from './global-event-dispatcher';
import { NgZone } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';
import { CommonModule } from '@angular/common';

describe('GlobalEventDispatcher', () => {
    let ngZone: NgZone;
    let globalEventDispatcher: GlobalEventDispatcher;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule]
        });
    });

    beforeEach(inject(
        [NgZone, GlobalEventDispatcher],
        (_ngZone: NgZone, _globalEventDispatcher: GlobalEventDispatcher) => {
            ngZone = _ngZone;
            globalEventDispatcher = _globalEventDispatcher;
        }
    ));

    it(`should create GlobalEventDispatcher`, () => {
        expect(globalEventDispatcher).toBeTruthy();
    });

    it(`should register event success`, () => {
        const testEventSpy = jasmine.createSpy('test-event spy');
        globalEventDispatcher.register('test-event').subscribe(testEventSpy);
        expect(testEventSpy).not.toHaveBeenCalled();
    });

    it(`should run in ngZone when dispatch event`, () => {
        const ngZoneRunSpy = spyOn(ngZone, 'run');
        const testEventSpy = jasmine.createSpy('test-event spy');
        globalEventDispatcher.register('test-event').subscribe(testEventSpy);
        expect(testEventSpy).not.toHaveBeenCalled();
        expect(ngZoneRunSpy).not.toHaveBeenCalled();
        globalEventDispatcher.dispatch('test-event');
        expect(ngZoneRunSpy).toHaveBeenCalled();
    });

    it(`should dispatch event success`, () => {
        const testEventSpy = jasmine.createSpy('test-event spy');
        globalEventDispatcher.register('test-event').subscribe(testEventSpy);
        expect(testEventSpy).not.toHaveBeenCalled();
        globalEventDispatcher.dispatch('test-event');
        expect(testEventSpy).toHaveBeenCalled();
    });

    it(`should dispatch event with parameters success`, () => {
        const testEventSpy = jasmine.createSpy('test-event spy');
        globalEventDispatcher.register('test-event').subscribe(testEventSpy);
        expect(testEventSpy).not.toHaveBeenCalled();
        globalEventDispatcher.dispatch('test-event', 'test-event-payload');
        expect(testEventSpy).toHaveBeenCalled();
        expect(testEventSpy).toHaveBeenCalledWith('test-event-payload');
    });
});
