import { TestBed } from '@angular/core/testing';

import { AuditoriasdetalleService } from './auditoriasdetalle.service';

describe('AuditoriasdetalleService', () => {
  let service: AuditoriasdetalleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditoriasdetalleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
