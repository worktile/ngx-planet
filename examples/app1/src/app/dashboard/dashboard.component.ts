import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MicroHostApplication } from '../../../../../packages/micro-core/src/lib/host-application';

@Component({
    selector: 'app-user-list',
    template: `
        This is dashboard <a href="javascript:;" (click)="toAbout()">About</a>
    `
})
export class DashboardComponent {
    constructor(private hostApplication: MicroHostApplication, private router: Router) {}

    toAbout() {
        // (window as any).toAbout();
        // this.router.dispose();
        this.hostApplication.navigateByUrl('/about');
        // this.hostApplication.router.navigateByUrl('/about');
    }
}
