import { ProxyDocument } from '../proxy/document';
import { SandboxPatchHandler } from '../types';

export function DocumentPatch(): SandboxPatchHandler {
    const proxyDocument = new ProxyDocument();
    const { document, Document } = proxyDocument.create();
    return {
        rewrite: {
            document,
            Document
        }
    };
}
