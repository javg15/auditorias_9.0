import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatentidadesAdminComponent } from './catentidades-admin.component';

describe('EntidadesAdminComponent', () => {
  let component: CatentidadesAdminComponent;
  let fixture: ComponentFixture<CatentidadesAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CatentidadesAdminComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatentidadesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
