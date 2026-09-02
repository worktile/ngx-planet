import { Component, OnInit, HostBinding, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app2-tasks',
    templateUrl: './tasks.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TasksComponent implements OnInit {
    @HostBinding('class') class = 'thy-layout';

    constructor() {
        const router = inject(Router);
        const route = inject(ActivatedRoute);

        // router.navigate(['./view-1'], { relativeTo: route });
        router.navigate(['./view-1'], { relativeTo: route, browserUrl: '/app2/t/xxx' });
    }

    ngOnInit(): void {}
}
