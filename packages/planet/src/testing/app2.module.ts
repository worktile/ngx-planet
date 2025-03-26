import {
    Component,
    NgModule,
    EnvironmentInjector,
    ApplicationRef,
    viewChild,
    createComponent,
    inject,
    TemplateRef,
    ChangeDetectorRef
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlanetApplicationLoader } from '../application/planet-application-loader';
import { PlanetComponentLoader } from '../component/planet-component-loader';

export const app2Name = 'app2';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'app2-comp-with-template-ref',
    template: `<ng-template #ref>This is templateRef from app2</ng-template>`,
    standalone: false
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
class ComponentWithTemplateRef {
    templateRef = viewChild<TemplateRef<unknown>>('ref');

    showDynamic = false;

    changeDetectorRef = inject(ChangeDetectorRef);

    constructor() {}
}

@NgModule({
    declarations: [ComponentWithTemplateRef],
    imports: [RouterModule.forChild([])],
    providers: [
        PlanetComponentLoader,
        {
            provide: PlanetApplicationLoader,
            useValue: {
                preload: () => {}
            }
        }
    ]
})
export class App2Module {
    environmentInjector = inject(EnvironmentInjector);

    applicationRef = inject(ApplicationRef);

    constructor() {}

    getComponentRefWithTemplateRef() {
        const componentRef = createComponent(ComponentWithTemplateRef, {
            environmentInjector: this.environmentInjector
        });
        this.applicationRef.attachView(componentRef.hostView);
        return componentRef.instance;
    }
}
