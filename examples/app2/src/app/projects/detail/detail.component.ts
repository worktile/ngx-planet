import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app2-project-detail',
    templateUrl: './detail.component.html'
})
export class ProjectDetailComponent implements OnInit {
    @HostBinding('class') class = 'thy-layout';

    projectId: string;

    constructor(private route: ActivatedRoute, router: Router) {
        this.route.paramMap.subscribe(params => {
            this.projectId = params.get('id');
            router.navigateByUrl(`/app2/projects/${this.projectId}/tasks`);
        });
    }

    ngOnInit() {}
}
