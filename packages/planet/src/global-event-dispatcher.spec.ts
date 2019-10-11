import { GlobalEventDispatcher } from './global-event-dispatcher';
import { NgZone } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
        const addEventListenerApy = spyOn(window, 'addEventListener');
        expect(addEventListenerApy).not.toHaveBeenCalled();
        expect(globalEventDispatcher.getSubscriptionCount()).toEqual(0);
        globalEventDispatcher.register('test-event').subscribe(testEventSpy);
        expect(globalEventDispatcher.getSubscriptionCount()).toEqual(1);
        expect(testEventSpy).not.toHaveBeenCalled();
        expect(addEventListenerApy).toHaveBeenCalled();
    });

    it(`should remove event listener when unsubscribe event success`, () => {
        const unsubscribe$ = new Subject();
        const removeEventListenerSpy = spyOn(window, 'removeEventListener');
        globalEventDispatcher
            .register('test-event')
            .pipe(takeUntil(unsubscribe$))
            .subscribe();
        expect(removeEventListenerSpy).not.toHaveBeenCalled();
        expect(globalEventDispatcher.getSubscriptionCount()).toEqual(1);
        unsubscribe$.next();
        unsubscribe$.complete();
        expect(removeEventListenerSpy).toHaveBeenCalled();
        expect(globalEventDispatcher.getSubscriptionCount()).toEqual(0);
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
