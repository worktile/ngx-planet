import { ProxySandboxInstance, SandboxPatch, SandboxPatchHandler } from '../types';
import { eventListenerPatch } from './eventListener';
import { documentPatch } from './document';
import { timerPatch } from './timer';
import { storagePatch } from './storage';

const sandboxPatches: SandboxPatch[] = [documentPatch, eventListenerPatch, timerPatch, storagePatch];

export function getSandboxPatchHandlers(sandbox: ProxySandboxInstance): SandboxPatchHandler[] {
    return sandboxPatches.map(patch => {
        return patch(sandbox);
    });
}
