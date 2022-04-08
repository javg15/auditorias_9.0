import { TestBed } from '@angular/core/testing';

import { CatservidoresService } from './catservidores.service';

describe('ServidoresService', () => {
  let service: CatservidoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatservidoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
