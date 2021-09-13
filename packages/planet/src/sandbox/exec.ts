import { Global } from './types';

export function execScript(code: string, url: string, global: Global, strictGlobal: boolean) {
    const sourceUrl = '//# sourceURL='.concat(url, '\n');
    const window = (0, eval)('window');
    window.tempGlobal = global;
    code = strictGlobal
        ? ';(function(window, self, globalThis){with(window){;'
              .concat(code, '\n')
              .concat(
                  sourceUrl,
                  '}}).bind(window.tempGlobal)(window.tempGlobal, window.tempGlobal, window.tempGlobal);'
              )
        : ';(function(window, self, globalThis){;'
              .concat(code, '\n')
              .concat(
                  sourceUrl,
                  '}).bind(window.tempGlobal)(window.tempGlobal, window.tempGlobal, window.tempGlobal);'
              );
    (0, eval)(code);
    delete window.tempGlobal;
}
