import { Sandbox, SandboxOptions } from '../sandbox';

export class SnapshotSandbox extends Sandbox {
    constructor(public app: string, public options: SandboxOptions) {
        super();
        this.start();
    }

    start() {
        this.running = true;
    }

    destroy() {
        this.running = false;
    }
}
