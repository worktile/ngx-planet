import { ProxyDocument } from '../proxies/document';
import { SandboxPatchHandler } from '../types';

export function documentPatch(): SandboxPatchHandler {
    const proxyDocument = new ProxyDocument();
    const { document, Document } = proxyDocument.create();
    return {
        rewrite: {
            document,
            Document
        }
    };
}
