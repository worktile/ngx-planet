import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { ThyDialog } from 'ngx-tethys/dialog';
import { ADetailComponent } from '../a-detail/a-detail.component';
import { AppRootContext } from '../app-root-context';

@Component({
    selector: 'app-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
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
