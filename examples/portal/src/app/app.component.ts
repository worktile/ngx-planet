import { Component, OnInit, inject } from '@angular/core';
import { AppRootContext } from '@demo/common';
import { GlobalEventDispatcher, Planet, PlanetComponentLoader, SwitchModes } from '@worktile/planet';
import { debug } from 'debug';
import { ThyDialog } from 'ngx-tethys/dialog';
import { ThyNotifyService } from 'ngx-tethys/notify';
import { ADetailComponent } from './a-detail/a-detail.component';
import { PortalCustomComponent } from './about/components/portal-custom.component';
import { CustomSettingsService } from './custom-settings.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false
})
export class AppComponent implements OnInit {
    private customSettingsService = inject(CustomSettingsService);
    private planet = inject(Planet);
    private globalEventDispatcher = inject(GlobalEventDispatcher);
    private thyDialog = inject(ThyDialog);
    private thyNotify = inject(ThyNotifyService);
    appRootContext = inject(AppRootContext);
    private planetComponentLoader = inject(PlanetComponentLoader);

    // @HostBinding('class.portal') class = true;

    title = '@worktile/planet';

    activeAppNames: string[] = [];

    get loading() {
        return this.planet.loading;
    }

    constructor() {}

    ngOnInit() {
        this.planet.setOptions({
            switchMode: SwitchModes.default,
            errorHandler: error => {
                this.thyNotify.error(`错误`, '加载资源失败');
                console.error(error);
            },
            debugFactory: debug
        });

        this.appRootContext.setName(`my name is app root context`);

        this.planet.setPortalAppData({
            appRootContext: this.appRootContext
        });

        const appHostClass = 'thy-layout';

        const settings = this.customSettingsService.get();
        this.planet.registerApps([
            {
                name: 'app1',
                hostParent: '#app-host-container',
                hostClass: appHostClass,
                routerPathPrefix: /\/app1|app4/, // '/app1',
                preload: settings.app1.preload,
                switchMode: settings.app1.switchMode,
                loadSerial: true,
                stylePrefix: 'app1',
                entry: '/static/app1/index.html',
                extra: {
                    name: '应用1',
                    color: '#ffa415'
                }
            },
            {
                name: 'app2',
                hostParent: '#app-host-container',
                hostClass: appHostClass,
                routerPathPrefix: '/app2',
                preload: settings.app2.preload,
                switchMode: settings.app2.switchMode,
                // sandbox: true, // 沙箱隔离开启后懒加载报错
                stylePrefix: 'app2',
                entry: {
                    basePath: '/static/app2/',
                    // manifest: '/static/app2/index.html',
                    manifest: '/static/app2/assets-manifest.json',
                    // prettier-ignore
                    scripts: [
                        'runtime.js', 'main.js'
                    ],
                    styles: ['styles.css']
                },
                extra: {
                    name: '应用2',
                    color: '#66c060'
                }
            },
            {
                name: 'standalone-app',
                hostParent: '#app-host-container',
                hostClass: appHostClass,
                routerPathPrefix: '/standalone-app',
                preload: settings.standaloneApp?.preload,
                switchMode: settings.standaloneApp?.switchMode,
                stylePrefix: 'standalone-app',
                entry: '/static/standalone-app/index.html',
                extra: {
                    name: '独立应用',
                    color: '#66c060'
                }
            }
        ]);

        this.planet.start();

        this.globalEventDispatcher.register('openADetail').subscribe(event => {
            this.thyDialog.open(ADetailComponent);
        });

        this.planet.appsLoadingStart.subscribe(event => {
            this.activeAppNames = event.shouldLoadApps.map(item => item.name);
            console.log(`active app names: ${this.activeAppNames.join(',')}`);
        });

        this.planetComponentLoader.register([PortalCustomComponent]);
    }
}
