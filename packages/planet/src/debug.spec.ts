import { createDebug, setDebugFactory, getDebugFactory, Debug, Debugger } from './debug';

describe('debug', () => {
    afterEach(() => {
        setDebugFactory(undefined);
    });

    it('should not throw error when create debug and log message', () => {
        const debug = createDebug('app-loader');
        debug('this is debug message');
        expect(debug['__isNoop']).toEqual(true);
    });

    it('should set debug factory success', () => {
        const mockDebugFactory = function(namespace: string): Debugger {
            return undefined;
        } as Debug;
        setDebugFactory(mockDebugFactory);
        const debugFactory = getDebugFactory();
        expect(debugFactory).toBe(mockDebugFactory);
    });

    it('should set debug factory fail', () => {
        const mockDebugFactory = {} as Debug;
        expect(() => {
            setDebugFactory(mockDebugFactory);
        }).toThrowError('debug factory type is invalid, must be function');
    });

    it('should use custom debug factory to debug', () => {
        const mockDebug = {
            mock: true
        };
        const mockDebugFactory = jasmine.createSpy('mock').and.callFake(namespace => {
            expect(namespace).toEqual('planet:app-loader');
            return mockDebug;
        });
        setDebugFactory(mockDebugFactory as any);
        const debug = createDebug('app-loader');
        expect(debug).toBe(mockDebug);
    });
});
