import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatresponsablesAdminComponent } from './catresponsables-admin.component';

describe('ResponsablesAdminComponent', () => {
  let component: CatresponsablesAdminComponent;
  let fixture: ComponentFixture<CatresponsablesAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CatresponsablesAdminComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatresponsablesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
