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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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

    private destroyed$ = new Subject<void>();

    constructor(
        private elementRef: ElementRef,
        private planetComponentLoader: PlanetComponentLoader,
        private ngZone: NgZone
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (this.planetComponentOutlet && !changes.planetComponentOutlet.isFirstChange()) {
            console.log(this.planetComponentOutlet);
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
                .pipe(takeUntil(this.destroyed$))
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
        this.destroyed$.complete();
    }

    clear() {
        this.componentRef?.dispose();
        this.destroyed$.next();
    }
}
