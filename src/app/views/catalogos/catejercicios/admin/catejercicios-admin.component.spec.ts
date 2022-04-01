import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatejerciciosAdminComponent } from './catejercicios-admin.component';

describe('EjerciciosAdminComponent', () => {
  let component: CatejerciciosAdminComponent;
  let fixture: ComponentFixture<CatejerciciosAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CatejerciciosAdminComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatejerciciosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
