import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriasAdminComponent } from './auditorias-admin.component';

describe('AuditoriasAdminComponent', () => {
  let component: AuditoriasAdminComponent;
  let fixture: ComponentFixture<AuditoriasAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditoriasAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
