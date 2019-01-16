import { Component, inject, InjectionToken } from '@angular/core';
import { GlobalEventDispatcher } from '../../../../../packages/micro-core/src/lib/global-event-dispatcher';

@Component({
    selector: 'app-user-list',
    template: `
        This is user list page <button thyButton="primary" (click)="openADetail()">Open a Detail</button>
    `
})
export class UserListComponent {
    constructor(private globalEventDispatcher: GlobalEventDispatcher) {}

    openADetail() {
        this.globalEventDispatcher.dispatch({
            name: 'openADetail',
            payload: null
        });
    }
}
