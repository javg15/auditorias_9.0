import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortabilidadFormComponent } from './portabilidad-form.component';

describe('PortabilidadFormComponent', () => {
  let component: PortabilidadFormComponent;
  let fixture: ComponentFixture<PortabilidadFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortabilidadFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortabilidadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
