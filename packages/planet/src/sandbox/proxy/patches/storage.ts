import { ProxySandboxInstance, SandboxPatchHandler } from '../types';

const PLANET_STORAGE_PREFIX = '__planet-storage-';

export class RewriteStorage {
    prefix: string;
    rawStorage: Storage;

    constructor(app: string, rawStorage: Storage) {
        this.rawStorage = rawStorage;
        this.prefix = `${PLANET_STORAGE_PREFIX}${app}__:`;
    }

    get length() {
        return this.getKeys().length;
    }

    private getKeys() {
        return Object.keys(this.rawStorage).filter(key => key.startsWith(this.prefix));
    }

    key(n: number) {
        const key = this.getKeys()[n];
        return key ? key.substring(this.prefix.length) : null;
    }

    getItem(key: string) {
        return this.rawStorage.getItem(`${this.prefix + key}`);
    }

    setItem(key: string, value: string) {
        this.rawStorage.setItem(`${this.prefix + key}`, value);
    }

    removeItem(key: string) {
        this.rawStorage.removeItem(`${this.prefix + key}`);
    }

    clear() {
        this.getKeys().forEach(key => {
            this.rawStorage.removeItem(key);
        });
    }
}

export function storagePatch(sandbox: ProxySandboxInstance): SandboxPatchHandler {
    return {
        rewrite: {
            localStorage: new RewriteStorage(sandbox.app, localStorage),
            sessionStorage: new RewriteStorage(sandbox.app, sessionStorage)
        }
    };
}
