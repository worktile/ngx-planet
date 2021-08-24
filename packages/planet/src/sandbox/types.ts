import { Sandbox } from './sandbox';

export type FakeWindow = Window & Record<PropertyKey, any>;
export type Module = (sandbox: Sandbox) => OverridesData;
export interface OverridesData {
    recover?: () => void;
    prepare?: () => void;
    created?: (context: Sandbox['global']) => void;
    override?: Record<PropertyKey, any>;
}
export interface ReplaceGlobalVariables {
    recoverList: Array<OverridesData['recover']>;
    prepareList: Array<OverridesData['prepare']>;
    createdList: Array<OverridesData['created']>;
    overrideList: Record<PropertyKey, any>;
}

export interface SandboxOptions {
    namespace: string;
    baseUrl?: string;
    useStrict?: boolean;
    openSandbox?: boolean;
    strictIsolation?: boolean;
    modules?: Array<Module>;
    sourceList?: Array<string>;
    loaderOptions?: any;
    el?: () => Element | ShadowRoot | null;
    protectVariable?: () => Array<PropertyKey>;
    insulationVariable?: () => Array<PropertyKey>;
}

export interface ExecScriptOptions {
    async?: boolean;
    noEntry?: boolean;
}
