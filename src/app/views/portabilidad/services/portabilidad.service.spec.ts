import { TestBed } from '@angular/core/testing';

import { PortabilidadService } from './portabilidad.service';

describe('EjerciciosService', () => {
  let service: PortabilidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortabilidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
