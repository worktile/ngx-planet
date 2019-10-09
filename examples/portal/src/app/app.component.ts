import { Component, OnInit, ChangeDetectorRef, ApplicationRef, NgZone } from '@angular/core';
import { Planet, SwitchModes, GlobalEventDispatcher, ApplicationStatus, PlanetApplication } from 'ngx-planet';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ThyDialog } from 'ngx-tethys/dialog';
import { ADetailComponent } from './a-detail/a-detail.component';
import { ThyConfirmService, ThyNotifyService } from 'ngx-tethys';
import { AppRootContext } from '@demo/common';

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
        private router: Router,
        private route: ActivatedRoute,
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

        const appHostContainerSelector = '#app-host-container';
        const appHostContainerClass = 'thy-layout';

        this.planet.registerApps([
            {
                name: 'app1',
                host: appHostContainerSelector,
                hostClass: appHostContainerClass,
                routerPathPrefix: /\/app1|app4/, // '/app1',
                selector: 'app1-root-container',
                resourcePathPrefix: '/app1/static/',
                preload: true,
                loadSerial: true,
                // prettier-ignore
                scripts: [
                    'main.js',
                    // 'polyfills.js'
                ],
                styles: ['assets/main.css'],
                manifest: '/app1/static/manifest.json',
                extra: {
                    name: '应用1',
                    color: '#ffa415'
                }
            },
            {
                name: 'app2',
                host: appHostContainerSelector,
                hostClass: appHostContainerClass,
                routerPathPrefix: '/app2',
                selector: 'app2-root-container',
                preload: true,
                // prettier-ignore
                scripts: [
                    '/app2/static/main.js'
                ],
                manifest: '/app2/static/manifest.json',
                extra: {
                    name: '应用2',
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
