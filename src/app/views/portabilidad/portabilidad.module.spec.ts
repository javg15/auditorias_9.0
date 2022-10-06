import { PortabilidadModule } from './portabilidad.module';

describe('PortabilidadModule', () => {
  let portabilidadModule: PortabilidadModule;

  beforeEach(() => {
    portabilidadModule = new PortabilidadModule();
  });

  it('should create an instance', () => {
    expect(portabilidadModule).toBeTruthy();
  });
});
