import { DOMApis, __MockBody__, __MockHead__, sourceListTags } from '@garfish/utils';
import { findTarget, makeMap, rootElm, transformUrl } from '../utils';
import { Sandbox } from '../sandbox';

const isInsertMethod = makeMap(['insertBefore', 'insertAdjacentElement']);

export const rawElementMethods = Object.create(null);

export class DynamicNodeProcessor {
    private el: any; // any Element
    private tagName: string;
    private sandbox: Sandbox;
    private DOMApis: DOMApis;
    private methodName: string;
    private nativeAppend: Function;
    private nativeRemove: Function;
    private rootElement: Element | ShadowRoot | Document;

    constructor(el, sandbox, methodName) {
        this.el = el;
        this.sandbox = sandbox;
        this.methodName = methodName;
        this.nativeAppend = rawElementMethods['appendChild'];
        this.nativeRemove = rawElementMethods['removeChild'];
        this.DOMApis = new DOMApis(sandbox.global.document);
        this.rootElement = rootElm(this.sandbox) || document;
        this.tagName = el.tagName ? el.tagName.toLowerCase() : '';

        // Deal with some static resource nodes
        if (sourceListTags.includes(this.tagName)) {
            this.fixResourceNodeUrl();
        }
    }

    private is(tag: string) {
        return this.tagName === tag;
    }

    private fixResourceNodeUrl() {
        const baseUrl = this.sandbox.options.baseUrl;
        if (baseUrl) {
            const src = this.el.getAttribute('src');
            const href = this.el.getAttribute('href');
            if (src) {
                this.el.src = transformUrl(baseUrl, src);
            }
            if (href) {
                this.el.href = transformUrl(baseUrl, href);
            }
            const url = this.el.src || this.el.href;
            if (url) {
                this.sandbox.options?.sourceList.push(url);
            }
        }
    }

    // Put it in the next macro task to ensure that the current synchronization script is executed
    private dispatchEvent(type: string) {
        setTimeout(() => {
            const event: Event & { garfish?: boolean } = new Event(type);
            event.garfish = true;
            Object.defineProperty(event, 'target', { value: this.el });
            this.el.dispatchEvent(event);
        });
    }

    // Load dynamic link node
    private addDynamicLinkNode(callback: (styleNode: HTMLStyleElement) => void) {
        // const { href, type } = this.el;
        // if (!type || isCss(parseContentType(type))) {
        //     if (href) {
        //         const { baseUrl, namespace = '' } = this.sandbox.options;
        //         const fetchUrl = baseUrl ? transformUrl(baseUrl, href) : href;
        //         this.sandbox.loader
        //             .load<StyleManager>(namespace, fetchUrl)
        //             .then(({ resourceManager: styleManager }) => {
        //                 this.dispatchEvent('load');
        //                 styleManager.correctPath();
        //                 callback(styleManager.renderAsStyleElement());
        //                 return;
        //             })
        //             .catch(e => {
        //                 // __DEV__ && warn(e);
        //                 this.dispatchEvent('error');
        //             });
        //     }
        // } else {
        //     // if (__DEV__) {
        //     //     warn(`Invalid resource type "${type}", "${href}"`);
        //     // }
        // }
        // return this.DOMApis.createLinkCommentNode(href) as Comment;
    }

    // Load dynamic js script
    private addDynamicScriptNode() {
        // const { src, type } = this.el;
        // const code = this.el.textContent || this.el.text || '';
        // if (!type || isJs(parseContentType(type))) {
        //   // The "src" higher priority
        //   const { baseUrl, namespace = '' } = this.sandbox.options;
        //   if (src) {
        //     const fetchUrl = baseUrl ? transformUrl(baseUrl, src) : src;
        //     this.sandbox.loader
        //       .load<JavaScriptManager>(namespace, fetchUrl)
        //       .then(({ resourceManager: { url, scriptCode } }) => {
        //         this.dispatchEvent('load');
        //         this.sandbox.execScript(scriptCode, {}, url, { noEntry: true });
        //       })
        //       .catch((e) => {
        //         __DEV__ && warn(e);
        //         this.dispatchEvent('error');
        //       });
        //   } else if (code) {
        //     this.sandbox.execScript(code, {}, baseUrl, { noEntry: true });
        //   }
        // } else {
        //   if (__DEV__) {
        //     warn(
        //       type === 'module'
        //         ? `Does not support "esm" module script in sandbox. "${src}"`
        //         : `Invalid resource type "${type}", "${src}"`,
        //     );
        //   }
        // }
        // return this.DOMApis.createScriptCommentNode({ src, code });
    }

    // When append an empty link node and then add href attribute
    private monitorChangesOfLinkNode() {
        if (this.el.modifyFlag) {
            return;
        }
        const mutator = new MutationObserver(mutations => {
            if (this.el.modifyFlag) {
                return;
            }
            for (const { type, attributeName } of mutations) {
                if (type === 'attributes') {
                    if (attributeName === 'rel' || attributeName === 'stylesheet') {
                        if (this.el.modifyFlag) {
                            return;
                        }
                        if (this.el.rel === 'stylesheet' && this.el.href) {
                            // this.el.disabled = this.el.modifyFlag = true;
                            // const commentNode = this.addDynamicLinkNode(styleNode => {
                            //     commentNode.parentNode?.replaceChild(styleNode, commentNode);
                            // });
                            // this.el.parentNode?.replaceChild(commentNode, this.el);
                        }
                    }
                }
            }
        });
        // https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/disconnect
        mutator.observe(this.el, { attributes: true });
    }

    private findParentNodeInApp(parentNode: Element, defaultInsert?: string) {
        if (parentNode === document.body) {
            return findTarget(this.rootElement, ['body', `div[${__MockBody__}]`]) as Element;
        }
        if (parentNode === document.head) {
            return findTarget(this.rootElement, ['head', `div[${__MockHead__}]`]) as Element;
        }

        // Add the location of the destination node is not a container to the container of the application
        // Has not been added to the container, or cannot be searched through document in shadow dom
        if (this.rootElement.contains(parentNode) || !document.contains(parentNode)) {
            return parentNode;
        }

        if (defaultInsert === 'head') {
            return findTarget(this.rootElement, ['head', `div[${__MockHead__}]`]) as Element;
        }

        if (defaultInsert === 'body') {
            return findTarget(this.rootElement, ['body', `div[${__MockBody__}]`]) as Element;
        }

        return parentNode;
    }

    append(context: Element, args: IArguments, originProcess: Function) {
        // let convertedNode;
        // let parentNode = context;
        // const { baseUrl } = this.sandbox.options;

        // this.sandbox.replaceGlobalVariables.recoverList.push(() => {
        //   this.DOMApis.removeElement(this.el);
        // });

        // Add dynamic script node by loader
        // if (this.is('script')) {
        //     parentNode = this.findParentNodeInApp(context, 'body');
        //     convertedNode = this.addDynamicScriptNode();
        // } else if (this.is('style')) {
        //     parentNode = this.findParentNodeInApp(context, 'head');
        //     if (baseUrl) {
        //         const manager = new StyleManager(this.el.textContent);
        //         manager.correctPath(baseUrl);
        //         this.el.textContent = manager.styleCode;
        //     }
        //     convertedNode = this.el;
        // } else if (this.is('link')) {
        //     parentNode = this.findParentNodeInApp(context, 'head');
        //     if (this.el.rel === 'stylesheet' && this.el.href) {
        //         convertedNode = this.addDynamicLinkNode(styleNode => this.nativeAppend.call(parentNode, styleNode));
        //     } else {
        //         convertedNode = this.el;
        //         this.monitorChangesOfLinkNode();
        //     }
        // }

        // if (__DEV__ || (this.sandbox?.global as any).__GARFISH__DEV__) {
        //     // The "window" on the iframe tags created inside the sandbox all use the "proxy window" of the current sandbox
        //     if (this.is('iframe') && typeof this.el.onload === 'function') {
        //         def(this.el, 'contentWindow', this.sandbox.global);
        //         def(this.el, 'contentDocument', this.sandbox.global.document);
        //     }
        // }

        // if (convertedNode) {
        //     // If it is "insertBefore" or "insertAdjacentElement" method, no need to rewrite when added to the container
        //     if (
        //         isInsertMethod(this.methodName) &&
        //         this.rootElement.contains(context) &&
        //         args[1]?.parentNode === context
        //     ) {
        //         return originProcess();
        //     }
        //     return this.nativeAppend.call(parentNode, convertedNode);
        // }
        return originProcess();
    }

    remove(context: Element, originProcess: Function) {
        if (this.is('style') || this.is('link') || this.is('script')) {
            const parentNode = this.findParentNodeInApp(context, this.is('script') ? 'body' : 'head');
            if (this.el.parentNode === parentNode) {
                return this.nativeRemove.call(parentNode, this.el);
            }
        }
        return originProcess();
    }
}
