import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CattiposauditoriaAdminComponent } from './cattiposauditoria-admin.component';

describe('TiposauditoriaAdminComponent', () => {
  let component: CattiposauditoriaAdminComponent;
  let fixture: ComponentFixture<CattiposauditoriaAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CattiposauditoriaAdminComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CattiposauditoriaAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
