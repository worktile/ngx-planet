import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { App3LibComponent } from './app3-lib.component';

describe('App3LibComponent', () => {
  let component: App3LibComponent;
  let fixture: ComponentFixture<App3LibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ App3LibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(App3LibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
