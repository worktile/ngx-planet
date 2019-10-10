import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
    selector: 'app2-root-container',
    template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
    @HostBinding(`class.thy-layout`) isThyLayout = true;

    constructor() {}

    ngOnInit() {}
}
