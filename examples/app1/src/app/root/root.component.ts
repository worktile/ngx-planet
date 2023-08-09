import { Component, HostBinding, NgZone, inject, ChangeDetectorRef, Injectable, OnInit, ViewRef } from '@angular/core';
import { GlobalEventDispatcher, routeRedirect } from 'ngx-planet';
import { ThyDialog } from 'ngx-tethys/dialog';
import { UserDetailComponent } from '../user/detail/user-detail.component';

@Component({
    selector: 'app1-root-actual',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.css']
})
export class AppActualRootComponent {
    @HostBinding(`class.thy-layout`) isLayout = true;

    redirect = routeRedirect('dashboard');

    constructor() {}
}

@Component({
    selector: 'app1-root',
    template: '<router-outlet></router-outlet>'
})
export class AppRootComponent {
    @HostBinding(`class.thy-layout`) isLayout = true;

    constructor(
        private globalEventDispatcher: GlobalEventDispatcher,
        private thyDialog: ThyDialog,
        private ngZone: NgZone
    ) {
        this.globalEventDispatcher.register('openUserDetail').subscribe((payload: number) => {
            thyDialog.open(UserDetailComponent, {
                initialState: {
                    userId: payload
                }
            });
        });
    }
}
