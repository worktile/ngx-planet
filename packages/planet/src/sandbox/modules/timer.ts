const rawSetTimeout = window.setTimeout;
const rawClearTimeout = window.clearTimeout;
const rawSetInterval = window.setInterval;
const rawClearInterval = window.clearInterval;

export const timeoutModule = () => {
    const timeout = new Set<number>();

    const setTimeout = (handler: TimerHandler, ms?: number | undefined, ...args: any[]) => {
        const timeoutId = rawSetTimeout(handler, ms, ...args);
        timeout.add(timeoutId);
        return timeoutId;
    };

    const clearTimeout = (timeoutId: number) => {
        timeout.delete(timeoutId);
        rawClearTimeout(timeoutId);
    };

    const recover = () => {
        timeout.forEach(timeoutId => {
            rawClearTimeout(timeoutId);
        });
    };

    return {
        recover,
        override: {
            setTimeout: setTimeout,
            clearTimeout: clearTimeout
        }
    };
};

export const intervalModule = () => {
    const timeout = new Set<number>();

    const setInterval = (callback: (...args: any[]) => void, ms: number, ...args: any[]) => {
        const intervalId = rawSetInterval(callback, ms, ...args);
        timeout.add(intervalId);
        return intervalId;
    };

    const clearInterval = (intervalId: number) => {
        timeout.delete(intervalId);
        rawClearInterval(intervalId);
    };

    const recover = () => {
        timeout.forEach(intervalId => {
            rawClearInterval(intervalId);
        });
    };

    return {
        recover,
        override: {
            setInterval: setInterval,
            clearInterval: clearInterval
        }
    };
};
