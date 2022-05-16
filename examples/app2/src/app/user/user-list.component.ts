import { Component, inject, InjectionToken } from '@angular/core';
import { GlobalEventDispatcher } from 'ngx-planet';
import { ThyDialog } from 'ngx-tethys/dialog';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html'
})
export class UserListComponent {
    constructor(private globalEventDispatcher: GlobalEventDispatcher, private thyDialog: ThyDialog) {}
}
