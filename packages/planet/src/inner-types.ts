export interface ScriptTagAttributes {
    type?: 'module' | 'text/script' | undefined;
    async?: string;
    defer?: string;
}

export interface LinkTagAttributes {
    rel?: string;
}

export type ScriptOrLinkTagAttributes = ScriptTagAttributes | LinkTagAttributes;

export interface AssetsTagItem {
    src: string;
    tagName?: 'link' | 'script';
    attributes?: ScriptOrLinkTagAttributes;
}
