import { PlanetApplication, PlanetApplicationEntry } from './planet.class';

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

export function getHTMLElement(selector: string | HTMLElement): HTMLElement | null {
    if (selector instanceof HTMLElement) {
        return selector;
    } else {
        return document.querySelector(selector);
    }
}

export function getTagNameByTemplate(template: string): string {
    const element = createElementByTemplate(template);
    return element ? element.nodeName : '';
}

export function createElementByTemplate(template: string) {
    if (!template) {
        return null;
    }
    const element = document.createRange().createContextualFragment(template).firstChild;
    if (element && element.nodeType === ELEMENT_NODE_TYPE) {
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

export function isObject<T extends object>(value: any): value is T {
    return value && typeof value === 'object';
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

export function getExtName(name: string) {
    const lastDotIndex = name.lastIndexOf('.');
    if (lastDotIndex >= 0) {
        return name.slice(lastDotIndex + 1);
    } else {
        return '';
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

export function buildFullPath(path: string, basePath?: string) {
    if (basePath) {
        if (path.startsWith(basePath)) {
            return path;
        } else {
            return `${basePath}${path}`;
        }
    }
    return path;
}

function getDefinedAssets(app: PlanetApplication) {
    if (app.entry) {
        return {
            scripts: isObject<PlanetApplicationEntry>(app.entry) ? app.entry.scripts : undefined,
            styles: isObject<PlanetApplicationEntry>(app.entry) ? app.entry.styles : undefined
        };
    }
    return {
        scripts: app.scripts,
        styles: app.styles
    };
}

export function getAssetsBasePath(app: PlanetApplication): string {
    let basePath: string;
    if (app.entry) {
        if (isObject<PlanetApplicationEntry>(app.entry)) {
            basePath = app.entry.basePath;
        } else {
            const lastDotIndex = app.entry.lastIndexOf('/');
            basePath = lastDotIndex > 0 ? app.entry.slice(0, lastDotIndex + 1) : undefined;
        }
    }
    return basePath || app.resourcePathPrefix;
}

/**
 * Get static resource full path
 * @param app PlanetApplication
 * @param manifestResult manifest
 */
export function getScriptsAndStylesFullPaths(app: PlanetApplication, basePath: string, manifestResult?: { [key: string]: string }) {
    let { scripts, styles } = getDefinedAssets(app);
    // combine resource path by manifest
    if (manifestResult) {
        if (scripts) {
            scripts = scripts.map(script => {
                return buildResourceFilePath(script, manifestResult);
            });
        } else {
            scripts = Object.keys(manifestResult)
                .filter(key => {
                    return getExtName(key) === 'js';
                })
                .map(key => {
                    return manifestResult[key];
                });
        }
        if (styles) {
            styles = styles.map(style => {
                return buildResourceFilePath(style, manifestResult);
            });
        } else {
            styles = Object.keys(manifestResult)
                .filter(key => {
                    return getExtName(key) === 'css';
                })
                .map(key => {
                    return manifestResult[key];
                });
        }
    }
    if (basePath) {
        scripts = scripts.map(script => {
            return buildFullPath(script, basePath);
        });
        styles = styles.map(style => {
            return buildFullPath(style, basePath);
        });
    }
    return {
        scripts: scripts || [],
        styles: styles || []
    };
}
