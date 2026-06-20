import { TestBed } from '@angular/core/testing';

import { CatState } from './cat-state';

describe('CatState', () => {
  let service: CatState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
