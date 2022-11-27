import {
    Directive,
    ViewContainerRef,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    Input,
    AfterViewInit,
    ElementRef,
    NgZone,
    Output,
    EventEmitter
} from '@angular/core';
import { PlanetComponentLoader } from './planet-component-loader';
import { PlanetComponentRef } from './planet-component-ref';

@Directive({
    selector: '[planetComponentOutlet]'
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class PlanetComponentOutlet implements OnChanges, OnDestroy, AfterViewInit {
    @Input() planetComponentOutlet: string;

    @Input() planetComponentOutletApp: string;

    @Input() planetComponentOutletInitialState: any;

    @Output() planetComponentLoad = new EventEmitter();

    private componentRef: PlanetComponentRef<unknown>;

    constructor(
        private viewContainerRef: ViewContainerRef,
        private elementRef: ElementRef,
        private planetComponentLoader: PlanetComponentLoader,
        private ngZone: NgZone
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (this.planetComponentOutlet && !changes.planetComponentOutlet.isFirstChange()) {
            this.loadComponent();
        }
    }

    ngAfterViewInit(): void {
        this.loadComponent();
    }

    loadComponent() {
        this.clear();
        if (this.planetComponentOutlet && this.planetComponentOutletApp) {
            this.planetComponentLoader
                .load(this.planetComponentOutletApp, this.planetComponentOutlet, {
                    container: this.elementRef.nativeElement,
                    initialState: this.planetComponentOutletInitialState
                })
                .subscribe(componentRef => {
                    this.componentRef = componentRef;
                    this.ngZone.run(() => {
                        Promise.resolve().then(() => {
                            this.planetComponentLoad.emit();
                        });
                    });
                });
        }
    }

    ngOnDestroy(): void {
        this.clear();
    }

    clear() {
        this.viewContainerRef.clear();
        this.componentRef?.dispose();
    }
}
