import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class UserDetailComponent implements OnInit {
    userId: string;

    constructor() {}

    ngOnInit() {
        // this.route.paramMap.subscribe(params => {
        //     const userId = params.get(`id`);
        //     this.userId = userId;
        // });
    }
}
