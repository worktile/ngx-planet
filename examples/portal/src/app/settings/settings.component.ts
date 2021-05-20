import { Component, OnInit, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { ThyNotifyService } from 'ngx-tethys/notify';
import { ADetailComponent } from '../a-detail/a-detail.component';
import { AppRootContext } from '@demo/common';
import { CustomSettingsService, CustomSettingsInfo } from '../custom-settings.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    @HostBinding(`class.thy-layout-content`) isThyLayoutContent = true;

    settings: CustomSettingsInfo;

    constructor(
        public appRootContext: AppRootContext,
        private customSettingsService: CustomSettingsService,
        private thyNotifyService: ThyNotifyService
    ) {}

    ngOnInit() {
        this.reset();
    }

    save() {
        this.customSettingsService.save(this.settings);
        this.thyNotifyService.success(`Save success`);
    }

    reset() {
        this.settings = {
            ...this.customSettingsService.get()
        };
    }

    restore() {
        this.customSettingsService.restore();
        this.reset();
    }
}
