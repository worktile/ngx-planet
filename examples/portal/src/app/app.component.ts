import { Component, OnInit, ChangeDetectorRef, ApplicationRef, NgZone } from '@angular/core';
import { Planet, SwitchModes, GlobalEventDispatcher } from 'ngx-planet';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';
import { ThyDialog } from 'ngx-tethys/dialog';
import { ADetailComponent } from './a-detail/a-detail.component';
import { ThyConfirmService, ThyNotifyService } from 'ngx-tethys';
import { AppRootContext } from '@demo/common';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'ngx-planet';

    get loadingDone() {
        return this.planet.loadingDone;
    }

    constructor(
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
                resourcePathPrefix: 'app1/static/',
                preload: false,
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
                preload: false,
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
    }
}
