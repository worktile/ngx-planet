import { isFunction } from '../../../helpers';
import { DOCUMENT_BIND_FN, PLANET_SANDBOX_DOCUMENT_WHITELIST, RAW_NODE } from '../../constants';
import {
    hasOwnProp,
    createFakeObject,
    isInvalidSetAccessor,
    isNonWriteableValue,
    bind,
    isInvalidGetAccessor
} from './common';

const rawDocument = Document;
const whitelist: PropertyKey[] = ['cookie', 'title', 'location', ...(PLANET_SANDBOX_DOCUMENT_WHITELIST || [])];

export class ProxyDocument {
    constructor() {}

    private createGetter() {
        return (target: any, p: PropertyKey, receiver?: any) => {
            const value = hasOwnProp(target, p) ? Reflect.get(target, p, receiver) : Reflect.get(document, p);
            if (p === 'activeElement') {
                return Reflect.get(document, p);
            }
            // TODO: 处理动态节点
            // if (p === 'createElement') {
            //     return function(tagName: string, options: ElementCreationOptions) {
            //         const created = value.call(document, tagName, options);
            //         if (isObject(created)) {
            //             created[SANDBOX_INSTANCE] = sandbox;
            //         }
            //         return created;
            //     };
            // }
            if (isFunction(value)) {
                let newValue = hasOwnProp(value, DOCUMENT_BIND_FN) ? value[DOCUMENT_BIND_FN] : null;
                if (!newValue) {
                    newValue = bind(value, document);
                }
                const desc = Object.getOwnPropertyDescriptor(target, p);
                if (isNonWriteableValue(desc)) {
                    if (!Object.is(newValue, desc.value)) {
                        return value;
                    }
                }
                if (isInvalidGetAccessor(desc)) {
                    return undefined;
                }
                value[DOCUMENT_BIND_FN] = newValue;
                return newValue;
            }
            return value;
        };
    }

    private createSetter() {
        return (target: any, p: PropertyKey, value: any, receiver: any) => {
            const desc = Object.getOwnPropertyDescriptor(whitelist.includes(p) ? document : receiver || target, p);
            if (isNonWriteableValue(desc)) {
                if (Object.is(value, desc.value)) {
                    return true;
                } else {
                    return false;
                }
            }
            if (isInvalidSetAccessor(desc)) {
                return false;
            }
            return whitelist.includes(p) ? Reflect.set(document, p, value) : Reflect.set(target, p, value, receiver);
        };
    }

    private createDefineProperty() {
        return (target: any, p: PropertyKey, descriptor: PropertyDescriptor) => {
            return whitelist.includes(p)
                ? Reflect.defineProperty(document, p, descriptor)
                : Reflect.defineProperty(target, p, descriptor);
        };
    }

    create() {
        let proxyDocument = null;
        const fakeDocument = createFakeObject(document);
        const getter = this.createGetter();
        const fakeDocumentProto = new Proxy(fakeDocument, {
            get: (...args) => {
                return getter(...args);
            }
        });
        const fakeDocumentCtor = function Document() {
            if (!(this instanceof fakeDocumentCtor)) {
                throw new TypeError(`Failed to construct 'Document': Please use the 'new' operator.`);
            }
            const docInstance = new rawDocument();
            Object.setPrototypeOf(docInstance, fakeDocument);
            return docInstance;
        };
        fakeDocumentCtor.prototype = fakeDocumentProto;
        fakeDocumentCtor.prototype.constructor = fakeDocumentCtor;
        if (Symbol.hasInstance) {
            Object.defineProperty(fakeDocumentCtor, Symbol.hasInstance, {
                configurable: true,
                value(value: any) {
                    let proto = value;
                    if (proto === document) {
                        return true;
                    }
                    while ((proto = Object.getPrototypeOf(proto))) {
                        if (proto === fakeDocumentProto) {
                            return true;
                        }
                    }
                    const cloned = function() {};
                    cloned.prototype = fakeDocument;
                    return value instanceof cloned;
                }
            });
        }
        proxyDocument = new Proxy(
            Object.create(fakeDocumentProto, {
                currentScript: {
                    value: null,
                    writable: true
                },
                [RAW_NODE]: {
                    writable: false,
                    configurable: false,
                    value: document
                }
            }),
            {
                set: this.createSetter(),
                defineProperty: this.createDefineProperty()
            }
        );
        return {
            document: proxyDocument,
            Document: fakeDocumentCtor
        };
    }
}
