import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

// 测试沙箱模拟主应用引入版本为3.0.0的lodash
window['lodash'] = {
    version: '3.0.0'
};

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
