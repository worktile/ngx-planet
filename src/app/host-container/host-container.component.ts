import { Component, OnInit, HostBinding } from '@angular/core';
import { Planet } from '../../../packages/micro-core/src/public_api';

@Component({
    selector: 'app-host-container',
    templateUrl: './host-container.component.html',
    styleUrls: ['./host-container.component.scss']
})
export class HostContainerComponent implements OnInit {
    @HostBinding('class.thy-layout1') isThyLayout = true;

    @HostBinding('class.loading')
    get loading() {
        return !this.planet || !this.planet.loadingDone;
    }

    constructor(public planet: Planet) {}

    ngOnInit() {}
}
