import { Component, OnInit } from '@angular/core';
import { MicroCoreService } from '../../packages/micro-core/src/public_api';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'ngx-micro-frontend';

    constructor(private micro: MicroCoreService, private router: Router) {}

    ngOnInit() {
        this.micro.registerApplication('app1', {
            routerPathPrefix: '/app1',
            scripts: ['app1/assets/runtime.js', 'app1/assets/vendor.js', 'app1/assets/main.js']
        });
        this.micro.registerApplication('app2', {
            routerPathPrefix: '/app2',
            scripts: []
        });
        debugger;
        this.micro.resetRouting({
            url: location.pathname,
            id: 1
        });
        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                this.micro.resetRouting(event);
                // this.micro.registerApplication();
                // that.mooa.reRouter(event);
            }
        });
    }
}
