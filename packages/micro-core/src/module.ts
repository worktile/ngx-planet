import { NgModule } from '@angular/core';
import { CoreComponent } from './lib/core.component';
import { GlobalEventDispatcher } from './lib/global-event-dispatcher';

@NgModule({
    declarations: [CoreComponent],
    imports: [],
    providers: [GlobalEventDispatcher],
    exports: [CoreComponent]
})
export class NgxMicroModule {}
