export function roundNumber(minNum: number, maxNum?: number): number {
    switch (arguments.length) {
        case 1:
            return parseInt((Math.random() * minNum + 1) as any, 10);
        case 2:
            return parseInt((Math.random() * (maxNum - minNum + 1) + minNum) as any, 10);
        default:
            return 0;
    }
}

export function sample<T>(items: T[]): T {
    const num = roundNumber(1, items.length);
    return items[num - 1];
}
