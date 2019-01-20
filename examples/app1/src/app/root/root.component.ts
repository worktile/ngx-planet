import { Component, HostBinding, NgZone } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.css']
})
export class AppRootComponent {
    @HostBinding(`class.thy-layout`) isLayout = true;
}
