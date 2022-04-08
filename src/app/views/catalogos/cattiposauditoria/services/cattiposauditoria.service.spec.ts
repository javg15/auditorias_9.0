import { TestBed } from '@angular/core/testing';

import { CattiposauditoriaService } from './cattiposauditoria.service';

describe('TiposauditoriaService', () => {
  let service: CattiposauditoriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CattiposauditoriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
