import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
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
