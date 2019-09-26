import { NgModule } from '@angular/core';
import { SectionCardComponent } from './section-card/section-card.component';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [SectionCardComponent],
    imports: [CommonModule],
    exports: [SectionCardComponent]
})
export class DemoCommonModule {}
