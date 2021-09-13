import { SandboxPatchHandler, ProxySandboxInstance } from '../types';
import { Observable, Subscription } from 'rxjs';

export function eventListenerPatch(sandbox: ProxySandboxInstance): SandboxPatchHandler {
    const rawAddEventListener = window.addEventListener;
    const rawRemoveEventListener = window.removeEventListener;
    const listenerSubscriptions = new Map<EventListenerOrEventListenerObject, Subscription>();

    function addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions
    ) {
        const observable = new Observable(() => {
            rawAddEventListener.call(this, type, listener, options);
            return () => {
                rawRemoveEventListener.call(this, type, listener, options);
            };
        });
        const subscription = observable.subscribe(() => {});
        listenerSubscriptions.set(listener, subscription);
    }

    function removeEventListener(type: string, listener: EventListenerOrEventListenerObject) {
        const subscription = listenerSubscriptions.get(listener);
        if (subscription) {
            subscription.unsubscribe();
            listenerSubscriptions.delete(listener);
        }
    }

    return {
        rewrite: {
            addEventListener: addEventListener.bind(window),
            removeEventListener: removeEventListener.bind(window)
        },
        init() {
            const fakeDocument = sandbox.global.document;
            if (fakeDocument) {
                fakeDocument.addEventListener = addEventListener.bind(document);
                fakeDocument.removeEventListener = removeEventListener.bind(document);
            }
        },
        destroy() {
            listenerSubscriptions.forEach(subscription => subscription.unsubscribe());
            listenerSubscriptions.clear();
        }
    };
}
