import { execScript } from './exec';
import { Global } from './types';

export interface SandboxOptions {
    strictGlobal?: boolean;
}

export abstract class Sandbox {
    options: SandboxOptions;

    global: Global;

    abstract start(): void;

    abstract destroy(): void;

    execScript(code: string, url = '') {
        execScript(code, url, this.global, this.options.strictGlobal);
    }
}
