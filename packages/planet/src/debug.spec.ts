import { createDebug, setDebugFactory, getDebugFactory, Debug, Debugger } from './debug';

describe('debug', () => {
    afterEach(() => {
        setDebugFactory(undefined);
    });

    it('should bypass create debug and log message', () => {
        const debug = createDebug('app-loader');
        debug('this is debug message');
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
        const mockDebug = jasmine.createSpy('mock debug');
        const mockDebugFactory = jasmine.createSpy('mock debug factory').and.callFake(namespace => {
            expect(namespace).toEqual('planet:app-loader');
            return mockDebug;
        });
        setDebugFactory(mockDebugFactory as any);
        const debug = createDebug('app-loader');
        expect(mockDebug).not.toHaveBeenCalled();
        debug('this is debug message');
        expect(mockDebug).toHaveBeenCalled();

        expect(mockDebug).toHaveBeenCalledWith('this is debug message', []);
    });
});
