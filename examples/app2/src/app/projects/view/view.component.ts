import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app2-view',
    templateUrl: './view.component.html'
})
export class ViewComponent implements OnInit {
    @HostBinding('class') class = 'thy-layout-content';

    viewId: string;

    constructor(private route: ActivatedRoute) {
        route.paramMap.subscribe(param => {
            this.viewId = param.get('viewId');
        });
    }

    ngOnInit(): void {}
}
