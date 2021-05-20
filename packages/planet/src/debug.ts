import { isFunction } from './helpers';

export interface Debugger {
    (formatter: any, ...args: any[]): void;

    // color: string;
    // enabled: boolean;
    // log: (...args: any[]) => any;
    // namespace: string;
    // destroy: () => boolean;
    // extend: (namespace: string, delimiter?: string) => Debugger;
}

export interface Formatters {
    [formatter: string]: (v: any) => string;
}

export interface Debug {
    (namespace: string): Debugger;
    coerce: (val: any) => any;
    disable: () => string;
    enable: (namespaces: string) => void;
    enabled: (namespaces: string) => boolean;
    log: (...args: any[]) => any;

    names: RegExp[];
    skips: RegExp[];

    formatters: Formatters;
}

/**
 * Debug factory for debug module
 */
let _debugFactory: Debug;

export function createDebug(namespace: string): Debugger {
    const debugFactory = getDebugFactory();
    if (debugFactory) {
        return debugFactory(`planet:${namespace}`);
    } else {
        const fallbackDebugger = function() {};
        fallbackDebugger.__isNoop = true;
        return fallbackDebugger as any;
    }
}

export function setDebugFactory(debug: Debug) {
    if (debug && !isFunction(debug)) {
        throw new Error('debug factory type is invalid, must be function');
    }
    _debugFactory = debug;
}

export function getDebugFactory() {
    return _debugFactory;
}
