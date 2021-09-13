import { Global } from '../types';

// SandboxInstance  主要是为了解决循环依赖
export interface ProxySandboxInstance {
    app: string;

    running: boolean;

    global: Global;

    rewriteVariables: PropertyKey[];
}

export interface SandboxPatchHandler {
    rewrite?: Record<PropertyKey, any>;
    init?: () => void;
    destroy?: () => void;
}

export type SandboxPatch = (sandbox?: ProxySandboxInstance) => SandboxPatchHandler;
