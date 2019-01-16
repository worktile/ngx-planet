import { Component, OnInit, HostBinding } from '@angular/core';
import { MicroCoreService } from '../../../packages/micro-core/src/public_api';

@Component({
    selector: 'app-load-app',
    templateUrl: './load-app.component.html',
    styleUrls: ['./load-app.component.scss']
})
export class LoadAppComponent implements OnInit {
    @HostBinding('class.thy-layout1') isThyLayout = true;

    constructor(private micro: MicroCoreService) {}

    ngOnInit() {}
}
