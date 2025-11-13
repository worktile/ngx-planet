import { Component, HostBinding, inject } from '@angular/core';
import { GlobalEventDispatcher } from '@worktile/planet';
import { ThyDialog } from 'ngx-tethys/dialog';
import { UserDetailComponent } from '../user/detail/user-detail.component';

@Component({
    selector: 'app1-root-actual',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.css'],
    standalone: false
})
export class AppActualRootComponent {
    @HostBinding(`class.thy-layout`) isLayout = true;

    constructor() {}
}

@Component({
    selector: 'app1-root',
    template: '<router-outlet></router-outlet>',
    standalone: false
})
export class AppRootComponent {
    private globalEventDispatcher = inject(GlobalEventDispatcher);
    private thyDialog = inject(ThyDialog);

    @HostBinding(`class.thy-layout`) isLayout = true;

    constructor() {
        const thyDialog = this.thyDialog;

        this.globalEventDispatcher.register('openUserDetail').subscribe((payload: number) => {
            thyDialog.open(UserDetailComponent, {
                initialState: {
                    userId: payload
                }
            });
        });
    }
}
