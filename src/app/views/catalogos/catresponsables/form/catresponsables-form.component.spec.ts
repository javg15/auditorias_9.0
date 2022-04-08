import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatresponsablesFormComponent } from './catresponsables-form.component';

describe('CatresponsablesFormComponent', () => {
  let component: CatresponsablesFormComponent;
  let fixture: ComponentFixture<CatresponsablesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatresponsablesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatresponsablesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
