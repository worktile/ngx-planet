import { Component, HostBinding, NgZone } from '@angular/core';
import { GlobalEventDispatcher } from '../../../../packages/planet/src/public_api';
import { ThyDialog } from 'ngx-tethys/dialog';
import { UserDetailComponent } from './user/detail/user-detail.component';

@Component({
    selector: 'app1-root-container',
    template: '<router-outlet></router-outlet>'
})
export class AppComponent {
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
