import { Component, OnInit, HostBinding, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ThyDialog } from 'ngx-tethys/dialog';
import { ADetailComponent } from '../a-detail/a-detail.component';
import { AppRootContext } from '@demo/common';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    standalone: false
})
export class AboutComponent implements OnInit {
    private router = inject(Router);
    private thyDialog = inject(ThyDialog);
    appRootContext = inject(AppRootContext);

    @HostBinding(`class.thy-layout-content`) isThyLayoutContent = true;

    constructor() {}

    ngOnInit() {}

    toApp2Dashboard() {
        this.router.navigateByUrl(`/app2/dashboard`);
    }

    openADetail() {
        this.thyDialog.open(ADetailComponent);
    }
}
