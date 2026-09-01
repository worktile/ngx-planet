import { Component, HostBinding, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'section-card',
    templateUrl: './section-card.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: []
})
export class SectionCardComponent {
    @HostBinding('class.section-card') addSectionCard = true;

    @Input() title: string;
}
