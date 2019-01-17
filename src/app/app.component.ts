import { Component, OnInit, ChangeDetectorRef, ApplicationRef, NgZone } from '@angular/core';
import { MicroPortalService } from '../../packages/micro-core/src/public_api';
import { Router, NavigationEnd } from '@angular/router';
import { GlobalEventDispatcher } from '../../packages/micro-core/src/lib/global-event-dispatcher';
import { ThyDialog } from 'ngx-tethys/dialog';
import { ADetailComponent } from './a-detail/a-detail.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'ngx-micro-frontend';

    constructor(
        private microPortal: MicroPortalService,
        private router: Router,
        private globalEventDispatcher: GlobalEventDispatcher,
        private thyDialog: ThyDialog,
        private changeDetectorRef: ChangeDetectorRef,
        private applicationRef: ApplicationRef,
        private ngZone: NgZone
    ) {}

    ngOnInit() {
        this.microPortal.registerApplication('app1', {
            host: 'app-host-container',
            routerPathPrefix: '/app1',
            selector: 'app1-root',
            // prettier-ignore
            scripts: [
                // 'app1/assets/runtime.js',
                // 'app1/assets/polyfills.js',
                'app1/assets/main.js'
            ]
        });
        this.microPortal.registerApplication('app2', {
            host: 'app-host-container',
            routerPathPrefix: '/app2',
            selector: 'app2-root',
            // prettier-ignore
            scripts: [
                'app2/assets/main.js'
            ]
        });

        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                this.microPortal.resetRouting(event);
                // this.micro.registerApplication();
            }
        });

        // (window as any).globalEventDispatcher = this.globalEventDispatcher;
        this.globalEventDispatcher.register('openADetail').subscribe(event => {
            this.thyDialog.open(ADetailComponent);
            // this.ngZone.run(() => {
            //     this.thyDialog.open(ADetailComponent);
            // });
        });
    }
}
