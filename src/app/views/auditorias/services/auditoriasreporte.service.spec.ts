import { TestBed } from '@angular/core/testing';

import { AuditoriasreporteService } from './auditoriasreporte.service';

describe('AuditoriasreporteService', () => {
  let service: AuditoriasreporteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditoriasreporteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
