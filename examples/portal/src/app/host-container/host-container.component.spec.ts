import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostContainerComponent } from './host-container.component';

describe('LoadAppComponent', () => {
    let component: HostContainerComponent;
    let fixture: ComponentFixture<HostContainerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HostContainerComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HostContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
