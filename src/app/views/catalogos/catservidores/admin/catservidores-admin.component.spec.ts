import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatservidoresAdminComponent } from './catservidores-admin.component';

describe('ServidoresAdminComponent', () => {
  let component: CatservidoresAdminComponent;
  let fixture: ComponentFixture<CatservidoresAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CatservidoresAdminComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatservidoresAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
