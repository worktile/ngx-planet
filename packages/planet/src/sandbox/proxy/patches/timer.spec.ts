import { fakeAsync, tick } from '@angular/core/testing';
import { timerPatch } from './timer';

describe('proxy-sandbox-timer-patch', () => {
    const timerPatcher = timerPatch();

    it('should setTimeout and clearTimeout success', fakeAsync(() => {
        const callbackSpy1 = jasmine.createSpy('time out callback one');
        timerPatcher.rewrite.setTimeout(callbackSpy1, 100);
        tick(100);
        expect(callbackSpy1).toHaveBeenCalledTimes(1);

        const callbackSpy2 = jasmine.createSpy('time out callback two');
        const timerId = timerPatcher.rewrite.setTimeout(callbackSpy2, 100);
        timerPatcher.rewrite.clearTimeout(timerId);
        tick(100);
        expect(callbackSpy2).not.toHaveBeenCalled();
    }));

    it('should setInterval and clearInterval success', fakeAsync(() => {
        const callbackSpy = jasmine.createSpy('interval callback one');
        const timerId = timerPatcher.rewrite.setInterval(callbackSpy, 100);
        tick(200);
        expect(callbackSpy).toHaveBeenCalledTimes(2);
        timerPatcher.rewrite.clearInterval(timerId);
        tick(100);
        expect(callbackSpy).toHaveBeenCalledTimes(2);
    }));

    it('should clear all timers when destroy', fakeAsync(() => {
        const timeoutCallbackSpy = jasmine.createSpy('time out callback');
        timerPatcher.rewrite.setTimeout(timeoutCallbackSpy, 100);
        const intervalCallbackSpy = jasmine.createSpy('interval callback');
        timerPatcher.rewrite.setInterval(intervalCallbackSpy, 100);
        // destroy
        timerPatcher.destroy();
        tick(200);
        expect(timeoutCallbackSpy).not.toHaveBeenCalled();
        expect(intervalCallbackSpy).not.toHaveBeenCalled();
    }));
});
