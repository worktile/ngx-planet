import { fakeAsync, tick } from '@angular/core/testing';
import { eventListenerPatch } from './eventListener';

describe('proxy-sandbox-event-listener-patch', () => {
    const sandbox = {
        global: {
            document: {}
        }
    } as any;

    const eventListenerPatcher = eventListenerPatch(sandbox);

    eventListenerPatcher.init();

    it('should addEventListener success', () => {
        const clickCallbackSpy1 = jasmine.createSpy();
        const clickCallbackSpy2 = jasmine.createSpy();
        eventListenerPatcher.rewrite.addEventListener('click', clickCallbackSpy1);
        sandbox.global.document.addEventListener('click', clickCallbackSpy2);
        document.body.click();
        expect(clickCallbackSpy1).toHaveBeenCalledTimes(1);
        expect(clickCallbackSpy2).toHaveBeenCalledTimes(1);
    });

    it('should removeEventListener success', () => {
        const clickCallbackSpy1 = jasmine.createSpy();
        const clickCallbackSpy2 = jasmine.createSpy();
        eventListenerPatcher.rewrite.addEventListener('click', clickCallbackSpy1);
        sandbox.global.document.addEventListener('click', clickCallbackSpy2);
        document.body.click();
        expect(clickCallbackSpy1).toHaveBeenCalledTimes(1);
        expect(clickCallbackSpy2).toHaveBeenCalledTimes(1);
        eventListenerPatcher.rewrite.removeEventListener('click', clickCallbackSpy1);
        sandbox.global.document.removeEventListener('click', clickCallbackSpy2);
        document.body.click();
        expect(clickCallbackSpy1).toHaveBeenCalledTimes(1);
        expect(clickCallbackSpy2).toHaveBeenCalledTimes(1);
    });

    it('should clear all event listener when ', () => {
        // 调用原生的 addEventListener
        const clickCallbackSpy1 = jasmine.createSpy();
        document.addEventListener('click', clickCallbackSpy1);

        // 调用重写后的 addEventListener
        const clickCallbackSpy2 = jasmine.createSpy();
        const clickCallbackSpy3 = jasmine.createSpy();
        eventListenerPatcher.rewrite.addEventListener('click', clickCallbackSpy2);
        sandbox.global.document.addEventListener('click', clickCallbackSpy3);

        document.body.click();

        expect(clickCallbackSpy1).toHaveBeenCalledTimes(1);
        expect(clickCallbackSpy2).toHaveBeenCalledTimes(1);
        expect(clickCallbackSpy3).toHaveBeenCalledTimes(1);

        // 调用patcher的销毁
        eventListenerPatcher.destroy();
        document.body.click();
        expect(clickCallbackSpy1).toHaveBeenCalledTimes(2);
        expect(clickCallbackSpy2).toHaveBeenCalledTimes(1);
        expect(clickCallbackSpy3).toHaveBeenCalledTimes(1);
    });
});
