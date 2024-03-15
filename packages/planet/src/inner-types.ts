export interface ScriptTagAttributes {
    type: 'module' | 'text/script' | undefined;
    async?: boolean;
}

export interface StyleTagAttributes {}

export interface AssetsTagItem {
    src: string;
    attributes?: ScriptTagAttributes | StyleTagAttributes;
}
