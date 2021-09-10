export type Global = Record<PropertyKey, any>;
export interface SandboxOptions {
    strictGlobal?: boolean;
}
export interface ISandbox {
    app: string;

    global: Global;

    rewriteVariables: PropertyKey[];

    running: boolean;

    start(): void;

    destroy(): void;

    execScript(code: string, url: string): void;
}
export interface SandboxPatchHandler {
    rewrite?: Record<PropertyKey, any>;
    init?: () => void;
    destroy?: () => void;
}

export type SandboxPatch = (sandbox?: ISandbox) => SandboxPatchHandler;
