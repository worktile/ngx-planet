import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'section-card',
    templateUrl: './section-card.component.html',
    imports: []
})
export class SectionCardComponent {
    @HostBinding('class.section-card') addSectionCard = true;

    @Input() title: string;
}
