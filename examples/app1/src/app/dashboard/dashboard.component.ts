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
    constructor(private hostApplication: MicroHostApplication) {}

    toAbout() {
        this.hostApplication.router.navigateByUrl('/about');
    }
}
