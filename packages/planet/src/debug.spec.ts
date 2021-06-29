import { createDebug, clearDebugFactory, setDebugFactory, getDebugFactory, Debug, Debugger } from './debug';

describe('debug', () => {
    afterEach(() => {
        clearDebugFactory();
    });

    it('should bypass create debug and log message', () => {
        const debug = createDebug('app-loader');
        debug('this is debug message');
        expect(true).toBe(true);
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

    it('should use cache debug for same namespace', () => {
        const mockDebugFactory = jasmine.createSpy('mock debug factory').and.callFake(namespace => {
            expect(namespace).toEqual('planet:app-loader');
            return jasmine.createSpy('mock debug');
        });
        setDebugFactory(mockDebugFactory as any);
        expect(mockDebugFactory).toHaveBeenCalledTimes(0);
        const debug1 = createDebug('app-loader');
        const debug2 = createDebug('app-loader');
        debug1('message1');
        debug2('message2');
        expect(mockDebugFactory).toHaveBeenCalledTimes(1);
    });
});
