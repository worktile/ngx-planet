import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app1-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    @HostBinding(`class.thy-layout`) isLayout = true;
}
