import { ProxySandbox } from './proxy-sandbox';

describe('proxy-sandbox', () => {
    const sandbox = new ProxySandbox('app', {});

    it('should create proxy sandbox and started', () => {
        expect(sandbox).not.toBeNull();
        expect(sandbox.running).toEqual(true);
        expect(sandbox.global).not.toEqual(window);
    });

    it('should exec script in sandbox', () => {
        const script = `
            window.test =  'test';
            window.testFunction = function(){};
        `;
        sandbox.execScript(script);
        expect(window['test']).toBeUndefined();
        expect(window['testFunction']).toBeUndefined();
        expect(sandbox.global.test).toEqual('test');
        expect(typeof sandbox.global.testFunction).toEqual('function');
    });
});
