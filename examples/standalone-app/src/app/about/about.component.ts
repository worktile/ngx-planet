import { Component, Inject, ViewChild, ElementRef, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true
})
export class AboutComponent implements OnInit {
    ngOnInit(): void {}
}
