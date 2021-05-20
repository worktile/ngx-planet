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
let _debuggerMap: Record<string, Debugger> = {};

export function createDebug(namespace: string): Debugger {
    const key = `planet:${namespace}`;
    return function(formatter: any, ...args: any[]) {
        if (_debugFactory) {
            let debugDebugger = _debuggerMap[key];
            if (!debugDebugger) {
                debugDebugger = _debugFactory(key);
                _debuggerMap[key] = debugDebugger;
            }
            debugDebugger(formatter, args);
        }
    };
}

export function setDebugFactory(debug: Debug) {
    if (debug && !isFunction(debug)) {
        throw new Error('debug factory type is invalid, must be function');
    }
    _debugFactory = debug;
}

export function clearDebugFactory() {
    setDebugFactory(undefined);
    _debuggerMap = {};
}

export function getDebugFactory() {
    return _debugFactory;
}
