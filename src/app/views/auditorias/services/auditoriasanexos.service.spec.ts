import { TestBed } from '@angular/core/testing';

import { AuditoriasanexosService } from './auditoriasanexos.service';

describe('AuditoriasanexosService', () => {
  let service: AuditoriasanexosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditoriasanexosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
