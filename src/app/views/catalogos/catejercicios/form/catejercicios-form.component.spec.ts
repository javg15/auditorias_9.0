import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatejerciciosFormComponent } from './catejercicios-form.component';

describe('CatejerciciosFormComponent', () => {
  let component: CatejerciciosFormComponent;
  let fixture: ComponentFixture<CatejerciciosFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatejerciciosFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatejerciciosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
