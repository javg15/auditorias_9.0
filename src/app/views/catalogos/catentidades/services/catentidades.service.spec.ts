import { TestBed } from '@angular/core/testing';

import { CatentidadesService } from './catentidades.service';

describe('EntidadesService', () => {
  let service: CatentidadesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatentidadesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
