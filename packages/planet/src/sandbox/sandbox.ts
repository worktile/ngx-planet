import { ProxyWindow } from './proxy/window';
import { getSandboxPatchHandlers } from './patches';
import { Global, ISandbox, SandboxOptions, SandboxPatchHandler } from './types';
import { SANDBOX_INSTANCE } from './constants';
import { execScript } from './exec';

const defaultOptions: Partial<SandboxOptions> = {
    strictGlobal: false
};

export function getSandboxInstance() {
    return window[SANDBOX_INSTANCE];
}

export class Sandbox implements ISandbox {
    public running = false;

    public global: Global;

    public rewriteVariables: PropertyKey[];

    private patchHandlers: SandboxPatchHandler[] = [];

    constructor(public app: string, public options?: SandboxOptions) {
        this.options = Object.assign({}, defaultOptions, this.options || {});
        this.patchHandlers = getSandboxPatchHandlers(this);
        this.start();
    }

    start() {
        this.running = true;
        this.rewriteVariables = this.getPatchRewriteVariables();
        const proxyWindow = new ProxyWindow(this);
        this.global = proxyWindow.create();
        this.execPatchHandlers();
    }

    destroy() {
        this.running = false;
        this.patchHandlers.forEach(handler => {
            if (handler.destroy) {
                handler.destroy();
            }
        });
    }

    execScript(code: string, url = '') {
        execScript(code, url, this.global, this.options.strictGlobal);
    }

    private getPatchRewriteVariables() {
        return this.patchHandlers.reduce((pre, cur) => {
            return [...pre, ...(cur.rewrite ? Object.keys(cur.rewrite) : [])];
        }, []);
    }

    private execPatchHandlers() {
        this.patchHandlers.forEach(handler => {
            if (handler.rewrite) {
                for (const key in handler.rewrite) {
                    if (handler.rewrite[key]) {
                        this.global[key] = handler.rewrite[key];
                    }
                }
            }
            if (handler.init) {
                handler?.init();
            }
        });
    }
}
