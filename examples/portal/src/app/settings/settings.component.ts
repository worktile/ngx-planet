import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { ThyDialog } from 'ngx-tethys/dialog';
import { ADetailComponent } from '../a-detail/a-detail.component';
import { AppRootContext } from '@demo/common';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
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
