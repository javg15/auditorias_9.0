import { AuditoriasModule } from './auditorias.module';

describe('AuditoriasModule', () => {
  let auditoriasModule: AuditoriasModule;

  beforeEach(() => {
    auditoriasModule = new AuditoriasModule();
  });

  it('should create an instance', () => {
    expect(auditoriasModule).toBeTruthy();
  });
});
