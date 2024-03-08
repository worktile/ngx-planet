import { Sandbox, SandboxOptions } from '../sandbox';

export class SnapshotSandbox extends Sandbox {
    constructor(
        public app: string,
        public override options: SandboxOptions
    ) {
        super();
        this.start();
    }

    start() {}

    destroy() {}
}
