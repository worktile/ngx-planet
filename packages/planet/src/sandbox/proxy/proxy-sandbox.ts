import { ProxyWindow } from './proxies/window';
import { getSandboxPatchHandlers } from './patches';
import { SandboxPatchHandler } from './types';
import { Global } from '../types';
import { Sandbox, SandboxOptions } from '../sandbox';

export class ProxySandbox extends Sandbox {
    public running = false;

    public global: Global;

    public rewriteVariables: PropertyKey[];

    private patchHandlers: SandboxPatchHandler[] = [];

    constructor(public app: string, public options: SandboxOptions) {
        super();
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
