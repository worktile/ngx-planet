import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ThyDialog } from 'ngx-tethys/dialog';
import { UserDetailComponent } from './detail/user-detail.component';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UserListComponent {
    private thyDialog = inject(ThyDialog);

    constructor() {}

    openUserDetail(id: number) {
        this.thyDialog.open(UserDetailComponent, {
            initialState: {
                userId: id
            }
        });
    }
}
