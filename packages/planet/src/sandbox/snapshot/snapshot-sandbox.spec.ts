import { SnapshotSandbox } from './snapshot-sandbox';

describe('snapshot-sandbox', () => {
    it('should create snapshot sandbox and started', () => {
        const sandbox = new SnapshotSandbox('app', {});
        expect(sandbox).not.toBeNull();
        expect(sandbox.running).toEqual(true);
    });

    it('should destroy success', () => {
        const sandbox = new SnapshotSandbox('app', {});
        sandbox.destroy();
        expect(sandbox.running).toEqual(false);
    });
});
