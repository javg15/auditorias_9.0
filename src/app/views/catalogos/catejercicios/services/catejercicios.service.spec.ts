import { TestBed } from '@angular/core/testing';

import { CatejerciciosService } from './catejercicios.service';

describe('EjerciciosService', () => {
  let service: CatejerciciosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatejerciciosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
