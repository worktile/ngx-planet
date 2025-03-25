import { Component, HostBinding, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'section-card',
    templateUrl: './section-card.component.html',
    imports: [NgIf]
})
export class SectionCardComponent {
    @HostBinding('class.section-card') addSectionCard = true;

    @Input() title: string;
}
