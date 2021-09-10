import { ISandbox, SandboxPatch, SandboxPatchHandler } from '../types';
import { EventListenerPatch } from './eventListener';
import { DocumentPatch } from './document';
import { TimerPatch } from './timer';
import { StoragePatch } from './storage';

const sandboxPatches: SandboxPatch[] = [DocumentPatch, EventListenerPatch, TimerPatch, StoragePatch];

export function getSandboxPatchHandlers(sandbox: ISandbox): SandboxPatchHandler[] {
    return sandboxPatches.map(patch => {
        return patch(sandbox);
    });
}
