import { Component, inject, InjectionToken } from '@angular/core';
import { GlobalEventDispatcher } from '../../../../../packages/micro-core/src/lib/global-event-dispatcher';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html'
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
