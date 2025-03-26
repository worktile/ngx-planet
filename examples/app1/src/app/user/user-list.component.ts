import { Component, inject, InjectionToken } from '@angular/core';
import { GlobalEventDispatcher } from '@worktile/planet';
import { ThyDialog } from 'ngx-tethys/dialog';
import { UserDetailComponent } from './detail/user-detail.component';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    standalone: false
})
export class UserListComponent {
    constructor(
        private globalEventDispatcher: GlobalEventDispatcher,
        private thyDialog: ThyDialog
    ) {}

    openUserDetail(id: number) {
        this.thyDialog.open(UserDetailComponent, {
            initialState: {
                userId: id
            }
        });
    }
}
