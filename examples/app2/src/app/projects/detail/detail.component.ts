import { Component, OnInit, HostBinding, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app2-project-detail',
    templateUrl: './detail.component.html',
    standalone: false
})
export class ProjectDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);

    @HostBinding('class') class = 'thy-layout';

    projectId: string;

    constructor() {
        const router = inject(Router);

        this.route.paramMap.subscribe(params => {
            this.projectId = params.get('id');
            router.navigateByUrl(`/app2/projects/${this.projectId}/tasks`);
        });
    }

    ngOnInit() {}
}
