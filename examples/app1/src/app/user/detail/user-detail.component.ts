import { Component, inject, InjectionToken, OnInit } from '@angular/core';
import { GlobalEventDispatcher } from '../../../../../../packages/micro-core/src/lib/global-event-dispatcher';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html'
})
export class UserDetailComponent implements OnInit {
    userId: string;

    constructor(private route: ActivatedRoute, private globalEventDispatcher: GlobalEventDispatcher) {}

    ngOnInit() {
        // this.route.paramMap.subscribe(params => {
        //     const userId = params.get(`id`);
        //     this.userId = userId;
        // });
    }
}
