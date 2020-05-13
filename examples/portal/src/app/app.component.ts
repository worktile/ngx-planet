import { Component, OnInit, ChangeDetectorRef, ApplicationRef, NgZone } from '@angular/core';
import { Planet, SwitchModes, GlobalEventDispatcher, ApplicationStatus, PlanetApplication } from 'ngx-planet';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ThyDialog } from 'ngx-tethys/dialog';
import { ADetailComponent } from './a-detail/a-detail.component';
import { ThyConfirmService, ThyNotifyService } from 'ngx-tethys';
import { AppRootContext } from '@demo/common';
import { CustomSettingsService } from './custom-settings.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    title = 'ngx-planet';

    activeAppNames: string[] = [];

    get loadingDone() {
        return this.planet.loadingDone;
    }

    constructor(
        private customSettingsService: CustomSettingsService,
        private planet: Planet,
        private globalEventDispatcher: GlobalEventDispatcher,
        private thyDialog: ThyDialog,
        private thyNotify: ThyNotifyService,
        public appRootContext: AppRootContext
    ) {}

    ngOnInit() {
        this.planet.setOptions({
            switchMode: SwitchModes.coexist,
            errorHandler: error => {
                this.thyNotify.error(`错误`, '加载资源失败');
            }
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
                selector: 'app1-root',
                resourcePathPrefix: '/static/app1/',
                preload: settings.app1.preload,
                switchMode: settings.app1.switchMode,
                loadSerial: true,
                // prettier-ignore
                scripts: [
                    'main.js',
                    // 'polyfills.js'
                ],
                styles: ['assets/main.css'],
                manifest: '/static/app1/manifest.json',
                extra: {
                    name: '应用1',
                    color: '#ffa415'
                }
            },
            {
                name: 'app2',
                hostParent: '#app-host-container',
                selector: 'app2-root',
                hostClass: appHostClass,
                routerPathPrefix: '/app2',
                preload: settings.app2.preload,
                switchMode: settings.app2.switchMode,
                // prettier-ignore
                scripts: [
                    '/static/app2/main.js'
                ],
                manifest: '/static/app2/manifest.json',
                extra: {
                    name: '应用2',
                    color: '#66c060'
                }
            },
            {
                name: 'app3',
                hostParent: '#app-host-container',
                selector: 'app3-root',
                hostClass: appHostClass,
                routerPathPrefix: '/app3',
                preload: settings.app3.preload,
                switchMode: settings.app3.switchMode,
                // prettier-ignore
                scripts: [
                    '/static/app3/main.js'
                ],
                manifest: '/static/app3/manifest.json',
                extra: {
                    name: '应用3',
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
    }
}
