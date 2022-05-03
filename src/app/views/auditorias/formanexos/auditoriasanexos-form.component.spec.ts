import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalexpedienteFormComponent } from './personalexpediente-form.component';

describe('PersonalexpedienteFormComponent', () => {
  let component: PersonalexpedienteFormComponent;
  let fixture: ComponentFixture<PersonalexpedienteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PersonalexpedienteFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalexpedienteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
