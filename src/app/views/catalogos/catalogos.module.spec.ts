import { CatalogosModule } from './catalogos.module';

describe('CatalogosModule', () => {
  let catalogosModule: CatalogosModule;

  beforeEach(() => {
    catalogosModule = new CatalogosModule();
  });

  it('should create an instance', () => {
    expect(catalogosModule).toBeTruthy();
  });
});
