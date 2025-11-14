import { Component, OnInit, HostBinding, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app2-view',
    templateUrl: './view.component.html',
    standalone: false
})
export class ViewComponent implements OnInit {
    private route = inject(ActivatedRoute);

    @HostBinding('class') class = 'thy-layout-content';

    viewId: string;

    constructor() {
        const route = this.route;

        route.paramMap.subscribe(param => {
            this.viewId = param.get('viewId');
        });
    }

    ngOnInit(): void {}
}
