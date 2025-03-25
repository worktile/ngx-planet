import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app2-tasks',
    templateUrl: './tasks.component.html',
    standalone: false
})
export class TasksComponent implements OnInit {
    @HostBinding('class') class = 'thy-layout';

    constructor(router: Router, route: ActivatedRoute) {
        // router.navigate(['./view-1'], { relativeTo: route });
        router.navigate(['./view-1'], { relativeTo: route, browserUrl: '/app2/t/xxx' });
    }

    ngOnInit(): void {}
}
