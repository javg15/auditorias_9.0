import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriasFormComponent } from './auditorias-form.component';

describe('AuditoriasFormComponent', () => {
  let component: AuditoriasFormComponent;
  let fixture: ComponentFixture<AuditoriasFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditoriasFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
