import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxPlanetModule } from '../module';

import { Component, DebugElement, OnInit } from '@angular/core';
import { PlanetComponentLoader } from './planet-component-loader';
import { PlantComponentConfig } from './plant-component.config';
import { Observable, Subject } from 'rxjs';
import { PlanetComponentRef } from './planet-component-ref';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'planet-component-outlet-basic-test',
    template: `
        <ng-container
            *planetComponentOutlet="componentName; app: 'app2'; initialState: { term: 'From Test' }"
        ></ng-container>
    `
})
export class PlanetComponentOutletBasicTestComponent implements OnInit {
    componentName = 'project1';

    constructor() {}

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngOnInit(): void {}
}

class MockPlanetComponentLoader {
    subject$ = new Subject<PlanetComponentRef>();

    disposed = false;

    mockPlanetComponentRef: PlanetComponentRef = {
        hostElement: null,
        dispose: () => {
            this.mockPlanetComponentRef.hostElement?.remove();
            this.disposed = true;
        }
    } as PlanetComponentRef;

    load<TComp = unknown, TData = unknown>(
        app: string,
        componentName: string,
        config: PlantComponentConfig<TData>
    ): Observable<PlanetComponentRef<TComp>> {
        return this.subject$.asObservable().pipe(
            tap(() => {
                const element = document.createElement(componentName);
                element.innerHTML = app;
                this.mockPlanetComponentRef.hostElement = element;
                (config.container as HTMLElement).parentElement.insertBefore(element, config.container as HTMLElement);
            })
        );
    }

    mockLoadComponentRefSuccess() {
        this.subject$.next(this.mockPlanetComponentRef);
    }
}

describe('planet-component-outlet', () => {
    let mockComponentLoader: MockPlanetComponentLoader;
    let fixture: ComponentFixture<PlanetComponentOutletBasicTestComponent>;

    beforeEach(() => {
        mockComponentLoader = new MockPlanetComponentLoader();
        TestBed.configureTestingModule({
            declarations: [PlanetComponentOutletBasicTestComponent],
            imports: [NgxPlanetModule],
            providers: [
                {
                    provide: PlanetComponentLoader,
                    useValue: mockComponentLoader
                }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlanetComponentOutletBasicTestComponent);
        fixture.detectChanges();
    });

    it(`should load app2's project1 success`, () => {
        const rootElement = fixture.debugElement.nativeElement as HTMLElement;
        mockComponentLoader.mockLoadComponentRefSuccess();
        expect(rootElement.innerHTML).toContain(`<project1>app2</project1>`);
    });

    it(`should dispose component when ngOnDestroy`, () => {
        const rootElement = fixture.debugElement.nativeElement as HTMLElement;
        mockComponentLoader.mockLoadComponentRefSuccess();
        expect(rootElement.innerHTML).toContain(`<project1>app2</project1>`);
        fixture.destroy();
        expect(mockComponentLoader.disposed).toBe(true);
        expect(rootElement.innerHTML).not.toContain(`<project1>app2</project1>`);
    });

    it(`should load component when name change`, () => {
        const rootElement = fixture.debugElement.nativeElement as HTMLElement;
        mockComponentLoader.mockLoadComponentRefSuccess();
        expect(rootElement.innerHTML).toContain(`<project1>app2</project1>`);
        fixture.componentInstance.componentName = 'other-component';
        fixture.detectChanges();
        expect(mockComponentLoader.disposed).toBe(true);
        mockComponentLoader.mockLoadComponentRefSuccess();
        expect(rootElement.innerHTML).not.toContain(`<project1>app2</project1>`);
        expect(rootElement.innerHTML).toContain(`<other-component>app2</other-component>`);
    });
});
