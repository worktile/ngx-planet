import { TestBed } from '@angular/core/testing';

import { App3LibService } from './app3-lib.service';

describe('App3LibService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: App3LibService = TestBed.get(App3LibService);
    expect(service).toBeTruthy();
  });
});
