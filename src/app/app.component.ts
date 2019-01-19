import { Component, OnInit, ChangeDetectorRef, ApplicationRef, NgZone } from '@angular/core';
import { Planet, SwitchModes } from '../../packages/micro-core/src/public_api';
import { Router, NavigationEnd } from '@angular/router';
import { GlobalEventDispatcher } from '../../packages/micro-core/src/lib/global-event-dispatcher';
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

        this.planet.registerApplication('app1', {
            host: appHostContainerSelector,
            hostClass: appHostContainerClass,
            routerPathPrefix: '/app1',
            selector: 'app1-root-container',
            // prettier-ignore
            scripts: [
                // 'app1/assets/runtime.js',
                // 'app1/assets/polyfills.js',
                'app1/assets/main.js'
            ]
        });
        this.planet.registerApplication('app2', {
            host: appHostContainerSelector,
            hostClass: appHostContainerClass,
            routerPathPrefix: '/app2',
            selector: 'app2-root-container',
            // prettier-ignore
            scripts: [
                'app2/assets/main.js'
            ]
        });

        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                this.planet.resetRouting(event);
            }
        });

        this.globalEventDispatcher.register('openADetail').subscribe(event => {
            this.thyDialog.open(ADetailComponent);
            // this.ngZone.run(() => {
            //     this.thyDialog.open(ADetailComponent);
            // });
        });
    }
}
