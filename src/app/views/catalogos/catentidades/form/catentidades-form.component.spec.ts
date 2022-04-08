import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatentidadesFormComponent } from './catentidades-form.component';

describe('CatentidadesFormComponent', () => {
  let component: CatentidadesFormComponent;
  let fixture: ComponentFixture<CatentidadesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatentidadesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatentidadesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
