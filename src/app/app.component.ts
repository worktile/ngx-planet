import { Component, OnInit, ChangeDetectorRef, ApplicationRef, NgZone } from '@angular/core';
import { Planet, SwitchModes, GlobalEventDispatcher } from '../../packages/planet/src/public_api';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';
import { ThyDialog } from 'ngx-tethys/dialog';
import { ADetailComponent } from './a-detail/a-detail.component';
import { ThyConfirmService, ThyNotifyService } from 'ngx-tethys';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'ngx-micro-frontend';

    get loadingDone() {
        return this.planet.loadingDone;
    }

    constructor(
        private planet: Planet,
        private router: Router,
        private globalEventDispatcher: GlobalEventDispatcher,
        private thyDialog: ThyDialog,
        private changeDetectorRef: ChangeDetectorRef,
        private applicationRef: ApplicationRef,
        private ngZone: NgZone,
        private thyNotify: ThyNotifyService
    ) {}

    ngOnInit() {
        this.planet.setOptions({
            switchMode: SwitchModes.coexist,
            errorHandler: error => {
                this.thyNotify.error(`错误`, '加载资源失败');
            }
        });

        const appHostContainerSelector = '#app-host-container';
        const appHostContainerClass = 'thy-layout';

        this.planet.registerApps([
            {
                name: 'app1',
                host: appHostContainerSelector,
                hostClass: appHostContainerClass,
                routerPathPrefix: '/app1',
                selector: 'app1-root-container',
                scriptPathPrefix: 'app1/assets/',
                // preload: true,
                // prettier-ignore
                scripts: [
                    'main.js'
                ]
            },
            {
                name: 'app2',
                host: appHostContainerSelector,
                hostClass: appHostContainerClass,
                routerPathPrefix: '/app2',
                selector: 'app2-root-container',
                // preload: true,
                // prettier-ignore
                scripts: [
                    'app2/assets/main.js'
                ]
            }
        ]);

        this.router.events.subscribe((event: RouterEvent) => {
            if (event instanceof NavigationEnd) {
                this.planet.resetRouting(event);
            }
        });

        this.globalEventDispatcher.register('openADetail').subscribe(event => {
            this.thyDialog.open(ADetailComponent);
        });
    }
}
