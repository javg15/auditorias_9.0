import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CattiposauditoriaFormComponent } from './cattiposauditoria-form.component';

describe('CattiposauditoriaFormComponent', () => {
  let component: CattiposauditoriaFormComponent;
  let fixture: ComponentFixture<CattiposauditoriaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CattiposauditoriaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CattiposauditoriaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
