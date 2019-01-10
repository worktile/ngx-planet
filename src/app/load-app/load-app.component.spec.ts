import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadAppComponent } from './load-app.component';

describe('LoadAppComponent', () => {
  let component: LoadAppComponent;
  let fixture: ComponentFixture<LoadAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
