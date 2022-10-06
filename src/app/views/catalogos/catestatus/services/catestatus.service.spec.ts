import { TestBed } from '@angular/core/testing';

import { CatestatusService } from './catestatus.service';

describe('EjerciciosService', () => {
  let service: CatestatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatestatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
