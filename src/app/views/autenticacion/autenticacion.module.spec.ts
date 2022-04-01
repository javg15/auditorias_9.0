import { AutenticacionModule } from './autenticacion.module';

describe('AutenticacionModule', () => {
  let autenticacionModule: AutenticacionModule;

  beforeEach(() => {
    autenticacionModule = new AutenticacionModule();
  });

  it('should create an instance', () => {
    expect(autenticacionModule).toBeTruthy();
  });
});
