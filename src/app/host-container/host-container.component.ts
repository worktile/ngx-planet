import { Component, OnInit, HostBinding } from '@angular/core';
import { MicroPortalService } from '../../../packages/micro-core/src/public_api';

@Component({
    selector: 'app-host-container',
    templateUrl: './host-container.component.html',
    styleUrls: ['./host-container.component.scss']
})
export class HostContainerComponent implements OnInit {
    @HostBinding('class.thy-layout') isThyLayout = true;

    constructor(private microPortal: MicroPortalService) {}

    ngOnInit() {}
}
