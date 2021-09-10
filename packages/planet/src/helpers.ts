import { PlanetApplication } from './planet.class';

const ELEMENT_NODE_TYPE = 1;

export function hashCode(str: string): number {
    let hash = 0;
    let chr: number;
    if (str.length === 0) {
        return hash;
    }
    for (let i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

export function getHTMLElement(selector: string | HTMLElement): HTMLElement {
    if (selector instanceof HTMLElement) {
        return selector;
    } else {
        return document.querySelector(selector);
    }
}

export function getTagNameByTemplate(template: string) {
    const element = createElementByTemplate(template);
    return element ? element.nodeName : null;
}

export function createElementByTemplate(template: string) {
    if (!template) {
        return null;
    }
    const element = document.createRange().createContextualFragment(template).firstChild;
    if (element.nodeType === ELEMENT_NODE_TYPE) {
        return element as HTMLElement;
    } else {
        throw new Error(`invalid template '${template}'`);
    }
}

export function coerceArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value];
}

export function isEmpty(value: any): boolean {
    if (!value || value.length === 0) {
        return true;
    } else {
        return false;
    }
}

export function isFunction(value: any): value is Function {
    const type = typeof value;
    return !!value && type === 'function';
}

export function isObject(val: any) {
    return val && typeof val === 'object';
}
/**
 * Get file name from path
 * 1. "main.js" => "main.js"
 * 2. "assets/scripts/main.js" => "main.js"
 * @param path path
 */
export function getResourceFileName(path: string) {
    const lastSlashIndex = path.lastIndexOf('/');
    if (lastSlashIndex >= 0) {
        return path.slice(lastSlashIndex + 1);
    } else {
        return path;
    }
}

/**
 * Build resource path by manifest
 * if manifest is { "main.js": "main.h2sh23abee.js"}
 * 1. "main.js" => "main.h2sh23abee.js"
 * 2. "assets/scripts/main.js" =>"assets/scripts/main.h2sh23abee.js"
 * @param resourceFilePath Resource File Path
 * @param manifestResult manifest
 */
export function buildResourceFilePath(resourceFilePath: string, manifestResult: { [key: string]: string }) {
    const fileName = getResourceFileName(resourceFilePath);
    if (manifestResult[fileName]) {
        return resourceFilePath.replace(fileName, manifestResult[fileName]);
    } else {
        return resourceFilePath;
    }
}

/**
 * Get static resource full path
 * @param app PlanetApplication
 * @param manifestResult manifest
 */
export function getScriptsAndStylesFullPaths(app: PlanetApplication, manifestResult?: { [key: string]: string }) {
    let scripts = app.scripts || [];
    let styles = app.styles || [];
    // combine resource path by manifest
    if (manifestResult) {
        scripts = scripts.map(script => {
            return buildResourceFilePath(script, manifestResult);
        });
        styles = styles.map(style => {
            return buildResourceFilePath(style, manifestResult);
        });
    }
    if (app.resourcePathPrefix) {
        scripts = scripts.map(script => {
            return `${app.resourcePathPrefix}${script}`;
        });
        styles = styles.map(style => {
            return `${app.resourcePathPrefix}${style}`;
        });
    }
    return {
        scripts: scripts,
        styles: styles
    };
}
