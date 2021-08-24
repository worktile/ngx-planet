import { Sandbox } from './sandbox';
import { __proxyNode__ } from './symbolTypes';

export const objectToString = Object.prototype.toString;

const hasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwn(obj: any, key: PropertyKey): boolean {
    return hasOwnProperty.call(obj, key);
}

// Array to Object `['a'] => { a: true }`
export function makeMap(list: Array<PropertyKey>) {
    const map = Object.create(null);
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true;
    }
    return val => map[val] as boolean;
}

export function nextTick(cb: () => void): void {
    Promise.resolve().then(cb);
}

export function findTarget(el: Element | ShadowRoot | Document, selectors: Array<string>) {
    for (const s of selectors) {
        const target = el.querySelector(s);
        if (target) {
            return target;
        }
    }
    return el;
}

export function isObject(val: any) {
    return val && typeof val === 'object';
}

export function transformUrl(resolvePath: string, curPath: string) {
    const baseUrl = new URL(resolvePath, location.href);
    const realPath = new URL(curPath, baseUrl.href);
    return realPath.href;
}

export function __extends(d, b) {
    Object.setPrototypeOf(d, b);

    function fNOP() {
        this.constructor = d;
    }

    if (b === null) {
        d.prototype = Object.create(b);
    } else {
        if (b.prototype) {
            fNOP.prototype = b.prototype;
        }
        d.prototype = new fNOP();
    }
}

// https://tc39.es/ecma262/#sec-function-properties-of-the-global-object
const esGlobalMethods = // Function properties of the global object // Function properties of the global object
(
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

export const isEsGlobalMethods = makeMap(esGlobalMethods);

// Need to optimize, avoid from the with
// Can't filter document, eval keywords, such as document in handling parentNode useful
export const optimizeMethods = [...esGlobalMethods].filter(v => v !== 'eval');

export function handlerParams(args: IArguments | Array<any>) {
    args = Array.isArray(args) ? args : Array.from(args);
    return args.map(v => {
        return v && v[__proxyNode__] ? v[__proxyNode__] : v;
    });
}

// Container node, because it changes all the time, take it as you use it
export function rootElm(sandbox: Sandbox) {
    const container = sandbox && sandbox.options.el;
    return container && container();
}

export const sandboxMap = {
    deps: new WeakMap(),

    get(element: Element): Sandbox {
        return this.deps.get(element);
    },

    set(element: Element, sandbox: Sandbox) {
        if (this.deps.get(element)) {
            return;
        }
        this.deps.set(element, sandbox);
    }
};

// Copy "window" and "document"
export function createFakeObject(
    target: Record<PropertyKey, any>,
    filter?: (PropertyKey) => boolean,
    isWritable?: (PropertyKey) => boolean
) {
    const fakeObject = {};
    const propertyMap = {};
    const storageBox = Object.create(null); // Store changed value
    const propertyNames = Object.getOwnPropertyNames(target);
    const def = (p: string) => {
        const descriptor = Object.getOwnPropertyDescriptor(target, p);

        if (descriptor?.configurable) {
            const hasGetter = hasOwn(descriptor, 'get');
            const hasSetter = hasOwn(descriptor, 'set');
            const canWritable = typeof isWritable === 'function' && isWritable(p);

            if (hasGetter) {
                // prettier-ignore
                descriptor.get = () => hasOwn(storageBox, p)
          ? storageBox[p]
          : target[p];
            }
            if (hasSetter) {
                descriptor.set = val => {
                    storageBox[p] = val;
                    return true;
                };
            }
            if (canWritable) {
                if (descriptor.writable === false) {
                    descriptor.writable = true;
                } else if (hasGetter) {
                    descriptor.set = val => {
                        storageBox[p] = val;
                        return true;
                    };
                }
            }
            Object.defineProperty(fakeObject, p, Object.freeze(descriptor));
        }
    };
    propertyNames.forEach(p => {
        propertyMap[p] = true;
        if (typeof filter === 'function') {
            if (!filter(p)) {
                def(p);
            } else {
                def(p);
            }
        }
    });
    // "prop" maybe in prototype chain
    for (const prop in target) {
        if (!propertyMap[prop]) {
            def(prop);
        }
    }
    return fakeObject as any;
}

let setting = true;
export function microTaskHtmlProxyDocument(proxyDocument) {
    // The HTML parent node into agent for the document
    // In micro tasks replace primary node
    const html = document.children[0];
    if (html && html.parentNode !== proxyDocument) {
        Object.defineProperty(html, 'parentNode', {
            value: proxyDocument,
            configurable: true
        });

        if (setting) {
            setting = false;
            // Do not use micro tasks, Element will appear in the task placed in nextTick after node
            nextTick(() => {
                setting = true;
                Object.defineProperty(html, 'parentNode', {
                    value: document,
                    configurable: true
                });
            });
        }
    }
}
