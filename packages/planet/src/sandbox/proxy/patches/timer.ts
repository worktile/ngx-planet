import { SandboxPatchHandler } from '../types';

const rawSetTimeout = window.setTimeout;
const rawClearTimeout = window.clearTimeout;
const rawSetInterval = window.setInterval;
const rawClearInterval = window.clearInterval;

export function timerPatch(): SandboxPatchHandler {
    const timeout = new Set<number>();
    const interval = new Set<number>();

    function rewriteSetTimeout(handler: TimerHandler, ms?: number, ...args: any[]) {
        const timeoutId = rawSetTimeout(handler, ms, ...args);
        timeout.add(timeoutId);
        return timeoutId;
    }

    function rewriteClearTimeout(timeoutId: number) {
        timeout.delete(timeoutId);
        rawClearTimeout(timeoutId);
    }

    function rewriteSetInterval(handler: TimerHandler, ms: number, ...args: any[]) {
        const intervalId = rawSetInterval(handler, ms, ...args);
        interval.add(intervalId);
        return intervalId;
    }

    function rewriteClearInterval(intervalId: number) {
        interval.delete(intervalId);
        rawClearInterval(intervalId);
    }

    return {
        rewrite: {
            setTimeout: rewriteSetTimeout,
            clearTimeout: rewriteClearTimeout,
            setInterval: rewriteSetInterval,
            clearInterval: rewriteClearInterval
        },
        destroy: () => {
            timeout.forEach(timeoutId => {
                rawClearTimeout(timeoutId);
            });
            interval.forEach(intervalId => {
                rawClearInterval(intervalId);
            });
        }
    };
}
