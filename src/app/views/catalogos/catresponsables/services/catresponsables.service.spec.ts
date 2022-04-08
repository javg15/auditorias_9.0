import { TestBed } from '@angular/core/testing';

import { CatresponsablesService } from './catresponsables.service';

describe('ResponsablesService', () => {
  let service: CatresponsablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatresponsablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
