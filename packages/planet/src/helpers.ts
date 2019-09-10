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

export function getResourceFileName(path: string) {
    const lastSlashIndex = path.lastIndexOf('/');
    if (lastSlashIndex >= 0) {
        return path.slice(lastSlashIndex + 1);
    } else {
        return path;
    }
}
