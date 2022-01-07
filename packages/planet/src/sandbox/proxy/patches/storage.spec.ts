import { storagePatch } from './storage';

describe('proxy-sandbox-storage-patch', () => {
    const storagePatcher = storagePatch({ app: 'app1' } as any);
    const cachePrefix = `__planet-storage-app1__`;

    function testStorage(windowStorage: Storage, rewriteStorage: Storage) {
        const storage: Storage = rewriteStorage;
        afterEach(() => {
            storage.clear();
            windowStorage.clear();
        });

        it('should set app1 storage success', () => {
            windowStorage.setItem('url', '/admin');
            storage.setItem('url', '/home');
            storage.setItem('user', 'walker');
            expect(windowStorage.getItem('url')).toEqual('/admin');
            expect(windowStorage.getItem(`${cachePrefix}url`)).toEqual('/home');
            expect(storage.getItem('url')).toEqual('/home');
            expect(storage.getItem('user')).toEqual('walker');
            expect(storage.length).toEqual(2);
        });

        it('should remove app1 storage success', () => {
            storage.setItem('url', '/home');
            expect(storage.length).toEqual(1);
            storage.removeItem('url');
            expect(window.localStorage.getItem(`${cachePrefix}url`)).toBeNull();
            expect(storage.getItem('url')).toBeNull();
            expect(storage.length).toEqual(0);
        });

        it('should get app1 storage key success ', () => {
            windowStorage.setItem('url', '/admin');
            storage.setItem('url', '/home');
            storage.setItem('user', 'walker');
            expect(storage.key(0)).toEqual('url');
            expect(storage.key(1)).toEqual('user');
        });

        it('should clear app1 storage success', () => {
            windowStorage.setItem('url', '/admin');
            storage.setItem('url', '/home');
            storage.clear();
            expect(storage.length).toEqual(0);
            expect(storage.getItem('url')).toBeNull();
            expect(windowStorage.getItem('url')).toEqual('/admin');
        });
    }

    describe('localStorage', () => {
        testStorage(window.localStorage, storagePatcher.rewrite.localStorage);
    });

    describe('sessionStorage', () => {
        testStorage(window.sessionStorage, storagePatcher.rewrite.sessionStorage);
    });
});
