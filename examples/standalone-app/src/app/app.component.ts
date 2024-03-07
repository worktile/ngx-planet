import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ThyLayout, ThyLayoutDirective, ThySidebar } from 'ngx-tethys/layout';
import { ThyMenu, ThyMenuItem } from 'ngx-tethys/menu';

@Component({
    selector: 'standalone-app-root',
    standalone: true,
    imports: [RouterOutlet],
    template: '<router-outlet />',
})
export class AppRootComponent {
    title = 'standalone-app';
}

@Component({
    selector: 'standalone-app-root-actual',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, ThyLayout, ThySidebar, ThyMenu, ThyMenuItem],
    templateUrl: './app.component.html',
    host: {
        class: 'thy-layout',
    },
    hostDirectives: [ThyLayoutDirective],
})
export class AppRootActualComponent {}
