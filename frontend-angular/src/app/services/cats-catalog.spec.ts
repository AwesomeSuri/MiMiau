import { TestBed } from '@angular/core/testing';

import { CatsCatalog } from './cats-catalog';

describe('CatCatalog', () => {
  let service: CatsCatalog;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatsCatalog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
