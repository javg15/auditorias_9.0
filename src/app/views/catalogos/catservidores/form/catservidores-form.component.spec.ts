import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatservidoresFormComponent } from './catservidores-form.component';

describe('CatservidoresFormComponent', () => {
  let component: CatservidoresFormComponent;
  let fixture: ComponentFixture<CatservidoresFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatservidoresFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatservidoresFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
