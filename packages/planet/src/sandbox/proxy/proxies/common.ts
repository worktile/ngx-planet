import { isObject } from '../../../helpers';
import { RAW_NODE } from '../../constants';

const rawHasOwnProperty = Object.prototype.hasOwnProperty;
export function hasOwnProp(obj: any, key: PropertyKey): boolean {
    return rawHasOwnProperty.call(obj, key);
}

export function isValueDescriptor(desc?: PropertyDescriptor) {
    if (desc === undefined) {
        return false;
    }
    return 'value' in desc || 'writable' in desc;
}

export function isAccessorDescriptor(desc?: PropertyDescriptor) {
    if (desc === undefined) {
        return false;
    }
    return 'get' in desc || 'set' in desc;
}

export function isNonWriteableValue(desc?: PropertyDescriptor) {
    return desc && desc.configurable === false && 'value' in desc && desc.writable === false;
}

export function isInvalidSetAccessor(desc?: PropertyDescriptor) {
    if (desc && desc.configurable === false && 'set' in desc && desc.set === undefined) {
        return true;
    } else {
        return false;
    }
}

export function isInvalidGetAccessor(desc?: PropertyDescriptor) {
    if (desc && desc.configurable === false && 'get' in desc && desc.get === undefined) {
        return true;
    } else {
        return false;
    }
}

function transferParams(args: IArguments | Array<any>) {
    args = Array.isArray(args) ? args : Array.from(args);
    return args.map(arg => {
        return arg[RAW_NODE] ? arg[RAW_NODE] : arg;
    });
}

const buildInProps: PropertyKey[] = ['length', 'caller', 'callee', 'arguments', 'prototype', Symbol.hasInstance];
function transferProps(o: Function, n: Function) {
    for (const key of Reflect.ownKeys(o)) {
        if (buildInProps.includes(key)) {
            continue;
        }
        const desc = Object.getOwnPropertyDescriptor(n, key);
        if (desc && desc.writable) {
            n[key] = o[key];
        }
    }
}

export function bind(fn: any, context: any) {
    const fNOP = function() {};
    function bound() {
        const args = transferParams(arguments);
        if (this instanceof bound) {
            const obj = new fn(...args);
            Object.setPrototypeOf(obj, bound.prototype);
            return obj;
        } else {
            return fn.apply(context, args);
        }
    }
    bound.$native = fn;
    transferProps(fn, bound);
    if (fn.prototype) {
        fNOP.prototype = fn.prototype;
    }
    bound.prototype = new fNOP();
    if (Symbol.hasInstance) {
        Object.defineProperty(bound, Symbol.hasInstance, {
            configurable: true,
            value(instance) {
                const op = fn.prototype;
                return isObject(op) || typeof op === 'function' ? instance instanceof fn : false;
            }
        });
    }
    return bound;
}

export function createFakeObject(target: Record<PropertyKey, any>, writableKeys?: PropertyKey[]) {
    const fakeObject = {};
    const propertyMap = {};
    const storageBox = Object.create(null);
    const propertyNames = Object.getOwnPropertyNames(target);
    const def = (p: string) => {
        const descriptor = Object.getOwnPropertyDescriptor(target, p);
        if (descriptor?.configurable) {
            const hasGetter = hasOwnProp(descriptor, 'get');
            const hasSetter = hasOwnProp(descriptor, 'set');
            const canWritable = writableKeys && writableKeys.length > 0 && writableKeys.includes(p);
            if (hasGetter) {
                descriptor.get = () => (hasOwnProp(storageBox, p) ? storageBox[p] : target[p]);
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
        def(p);
    });
    // 再次循环是为了处理原型链中的属性
    for (const prop in target) {
        if (!propertyMap[prop]) {
            def(prop);
        }
    }
    return fakeObject as any;
}
