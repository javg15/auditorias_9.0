import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriasdetalleFormComponent } from './auditoriasdetalle-form.component';

describe('AuditoriasdetalleFormComponent', () => {
  let component: AuditoriasdetalleFormComponent;
  let fixture: ComponentFixture<AuditoriasdetalleFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditoriasdetalleFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriasdetalleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
