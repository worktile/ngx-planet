import { Component, ChangeDetectionStrategy } from '@angular/core';
@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UserListComponent {
    constructor() {}
}
