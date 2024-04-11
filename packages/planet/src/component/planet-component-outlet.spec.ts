import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgxPlanetModule } from '../module';

import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PlanetComponentLoader } from './planet-component-loader';
import { PlanetComponentRef } from './planet-component-types';
import { PlantComponentConfig } from './plant-component.config';

@Component({
    selector: 'planet-component-outlet-basic-test',
    template: ` <ng-container *planetComponentOutlet="componentName; app: 'app2'; initialState: { term: 'From Test' }"></ng-container> `
})
export class PlanetComponentOutletBasicTestComponent implements OnInit {
    componentName = 'project1';

    constructor() {}

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngOnInit(): void {}
}

@Component({
    selector: 'planet-component-outlet-general-test',
    template: `
        <ng-container
            planetComponentOutlet="project1"
            planetComponentOutletApp="app2"
            planetComponentOutletInitialState="{ term: 'From Test' }"
            (planetComponentLoaded)="componentLoaded($event)"></ng-container>
    `
})
export class PlanetComponentOutletGeneralTestComponent {
    planetComponentRef: PlanetComponentRef;

    constructor() {}

    componentLoaded($event: PlanetComponentRef) {
        this.planetComponentRef = $event;
    }
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

    beforeEach(() => {
        mockComponentLoader = new MockPlanetComponentLoader();
        TestBed.configureTestingModule({
            declarations: [PlanetComponentOutletBasicTestComponent, PlanetComponentOutletGeneralTestComponent],
            imports: [NgxPlanetModule],
            providers: [
                {
                    provide: PlanetComponentLoader,
                    useValue: mockComponentLoader
                }
            ]
        }).compileComponents();
    });

    describe('structural-directive', () => {
        let fixture: ComponentFixture<PlanetComponentOutletBasicTestComponent>;
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

    describe('general-directive', () => {
        let fixture: ComponentFixture<PlanetComponentOutletGeneralTestComponent>;
        beforeEach(() => {
            fixture = TestBed.createComponent(PlanetComponentOutletGeneralTestComponent);
            fixture.detectChanges();
        });

        it(`should load app2's project1 success`, () => {
            const rootElement = fixture.debugElement.nativeElement as HTMLElement;
            mockComponentLoader.mockLoadComponentRefSuccess();
            expect(rootElement.innerHTML).toContain(`<project1>app2</project1>`);
        });

        it(`should call planetComponentLoad with planetComponentRef`, fakeAsync(() => {
            mockComponentLoader.mockLoadComponentRefSuccess();
            tick();
            expect(fixture.componentInstance.planetComponentRef).toBe(mockComponentLoader.mockPlanetComponentRef);
        }));
    });
});
