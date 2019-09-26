import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { ThyDialog } from 'ngx-tethys/dialog';
import { ADetailComponent } from '../a-detail/a-detail.component';
import { AppRootContext } from '@demo/common';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
    @HostBinding(`class.thy-layout-content`) isThyLayoutContent = true;

    constructor(private router: Router, private thyDialog: ThyDialog, public appRootContext: AppRootContext) {}

    ngOnInit() {}

    toApp2Dashboard() {
        this.router.navigateByUrl(`/app2/dashboard`);
    }

    openADetail() {
        this.thyDialog.open(ADetailComponent);
    }
}
