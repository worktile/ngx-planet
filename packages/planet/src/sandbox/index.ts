import { SandboxOptions } from './sandbox';
import { ProxySandbox } from './proxy/proxy-sandbox';
import { SnapshotSandbox } from './snapshot/snapshot-sandbox';
import { SANDBOX_INSTANCE } from './constants';

export { Sandbox } from './sandbox';

const defaultOptions: Partial<SandboxOptions> = {
    strictGlobal: false
};

export function createSandbox(app: string, options?: SandboxOptions) {
    options = Object.assign({}, defaultOptions, options || {});

    if (window.Proxy) {
        return new ProxySandbox(app, options);
    } else {
        return new SnapshotSandbox(app, options);
    }
}

export function getSandboxInstance() {
    return window[SANDBOX_INSTANCE];
}
