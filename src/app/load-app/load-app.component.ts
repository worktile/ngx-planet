import { Component, OnInit } from '@angular/core';
import { MicroCoreService } from '../../../packages/micro-core/src/public_api';

@Component({
    selector: 'app-load-app',
    templateUrl: './load-app.component.html',
    styleUrls: ['./load-app.component.scss']
})
export class LoadAppComponent implements OnInit {
    constructor(private micro: MicroCoreService) {}

    ngOnInit() {}
}
