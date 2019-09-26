import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NgxPlanetModule } from '../module';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { EmptyComponent } from './empty.component';

@Component({
    selector: 'empty-component-basic',
    template: '<empty-component></empty-component>'
})
class EmptyComponentBasicComponent {}

describe('empty-component', () => {
    let fixture: ComponentFixture<EmptyComponentBasicComponent>;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [EmptyComponentBasicComponent],
            imports: [NgxPlanetModule]
        });
        fixture = TestBed.createComponent(EmptyComponentBasicComponent);
        TestBed.compileComponents();
    });

    it(`should create empty component`, () => {
        const emptyComponentDebugElement = fixture.debugElement.query(By.directive(EmptyComponent));
        expect(emptyComponentDebugElement).toBeTruthy();
        expect(emptyComponentDebugElement.componentInstance).toBeTruthy();
    });

    it(`should content is empty in empty component`, () => {
        const emptyComponentDebugElement = fixture.debugElement.query(By.directive(EmptyComponent));
        expect((emptyComponentDebugElement.nativeElement as HTMLElement).children.length).toBe(0);
    });
});
