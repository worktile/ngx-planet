export function hashCode(str: string) {
    let hash = 0,
        i,
        chr;
    if (str.length === 0) {
        return hash;
    }
    for (i = 0; i < str.length; i++) {
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

export function isEmpty(value: any) {
    if (!value || value.length === 0) {
        return true;
    } else {
        return false;
    }
}
