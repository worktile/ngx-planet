import {
    hasOwnProp,
    createFakeObject,
    bind,
    isInvalidSetAccessor,
    isNonWriteableValue,
    isInvalidGetAccessor
} from './common';
import { PLANET_SANDBOX_WINDOW_WHITELIST, SANDBOX_INSTANCE, WINDOW_BIND_FN } from '../../constants';
import { isFunction } from '../../../helpers';
import { ProxySandboxInstance } from '../types';

const esGlobalFunctions: PropertyKey[] = (
    'eval,isFinite,isNaN,parseFloat,parseInt,' +
    // URL handling functions
    'decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    // Constructor properties of the global object
    'Array,ArrayBuffer,BigInt,BigInt64Array,BigUint64Array,Boolean,DataView,Date,Error,EvalError,' +
    'FinalizationRegistry,Float32Array,Float64Array,Function,Int8Array,Int16Array,Int32Array,Map,Number,' +
    'Object,Promise,Proxy,RangeError,ReferenceError,RegExp,Set,SharedArrayBuffer,String,Symbol,SyntaxError,' +
    'TypeError,Uint8Array,Uint8ClampedArray,Uint16Array,Uint32Array,URIError,WeakMap,WeakRef,WeakSet,' +
    // Other Properties of the Global Object
    'Atomics,JSON,Math,Reflect'
).split(',');

const whitelistVariables = PLANET_SANDBOX_WINDOW_WHITELIST || [];

function isConstructor(fn: () => void | FunctionConstructor) {
    const fp = fn.prototype;
    const hasConstructor = fp && fp.constructor === fn && Object.getOwnPropertyNames(fp).length > 1;
    const functionStr = !hasConstructor && fn.toString();
    return hasConstructor || /^function\s+[A-Z]/.test(functionStr) || /^class\b/.test(functionStr);
}

const unscopables = {
    undefined: true,
    Array: true,
    Object: true,
    String: true,
    Boolean: true,
    Math: true,
    Number: true,
    Symbol: true,
    parseFloat: true,
    Float32Array: true
};

export class ProxyWindow {
    constructor(private sandbox: ProxySandboxInstance) {}

    private definedVariables = new Set();

    private createGetter() {
        return (target: Window, key: PropertyKey, receiver: any) => {
            if (key === Symbol.unscopables) {
                return unscopables;
            }
            if (key === SANDBOX_INSTANCE) {
                return this.sandbox;
            }
            let value = null;
            if (whitelistVariables.includes(key)) {
                return Reflect.get(window, key);
            } else {
                value = hasOwnProp(target, key) ? Reflect.get(target, key, receiver) : Reflect.get(window, key);
            }
            if (isFunction(value)) {
                if (
                    esGlobalFunctions.includes(key) ||
                    whitelistVariables.includes(key) ||
                    this.sandbox.rewriteVariables.includes(key) ||
                    this.definedVariables.has(key) ||
                    isConstructor(value)
                ) {
                    return value;
                } else {
                    const newValue = hasOwnProp(value, WINDOW_BIND_FN) ? value[WINDOW_BIND_FN] : bind(value, window);
                    const desc = Object.getOwnPropertyDescriptor(target, key);
                    if (isNonWriteableValue(desc)) {
                        return value;
                    }
                    if (isInvalidGetAccessor(desc)) {
                        return undefined;
                    }
                    value[WINDOW_BIND_FN] = newValue;
                    return newValue;
                }
            } else {
                return value;
            }
        };
    }

    private createSetter() {
        return (target: Window, key: PropertyKey, value: unknown, receiver: any) => {
            const desc = Object.getOwnPropertyDescriptor(
                whitelistVariables.includes(key) ? window : receiver ? receiver : target,
                key
            );
            if (isNonWriteableValue(desc)) {
                if (!Object.is(value, desc.value)) {
                    return false;
                } else {
                    return true;
                }
            }
            if (isInvalidSetAccessor(desc)) {
                return false;
            }
            if (whitelistVariables.includes(key)) {
                return Reflect.set(window, key, value);
            } else {
                const success = Reflect.set(target, key, value, receiver);
                if (success) {
                    if (this.sandbox.running) {
                        this.definedVariables.add(key);
                    }
                }
                return success;
            }
        };
    }

    private createDefineProperty() {
        return (target: Window, p: PropertyKey, descriptor: PropertyDescriptor) => {
            if (whitelistVariables.includes(p)) {
                return Reflect.defineProperty(window, p, descriptor);
            } else {
                const success = Reflect.defineProperty(target, p, descriptor);
                if (this.sandbox.running && success) {
                    this.definedVariables.add(p);
                }
                return success;
            }
        };
    }

    private createDeleteProperty() {
        return (target: Window, p: PropertyKey) => {
            if (hasOwnProp(target, p)) {
                delete target[p];
                if (this.sandbox.running && this.definedVariables.has(p)) {
                    this.definedVariables.delete(p);
                }
            }
            return true;
        };
    }

    private createHas() {
        return (_target: Window, key: PropertyKey) => {
            return !whitelistVariables.includes(key);
        };
    }

    create() {
        const fakeWindow = createFakeObject(window, this.sandbox.rewriteVariables);
        const baseHandlers = {
            get: this.createGetter(),
            set: this.createSetter(),
            defineProperty: this.createDefineProperty(),
            deleteProperty: this.createDeleteProperty()
        };
        const proxy = new Proxy(fakeWindow, {
            ...baseHandlers,
            has: this.createHas()
        });
        const subProxy = new Proxy(fakeWindow, baseHandlers);
        proxy.self = subProxy;
        proxy.window = subProxy;
        proxy.globalThis = subProxy;
        proxy.top = window.top === window ? subProxy : window.top;
        proxy.parent = window.parent === window ? subProxy : window.top;
        return proxy;
    }
}
