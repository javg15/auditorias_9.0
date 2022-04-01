import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosFormdirectComponent } from './usuarios-formdirect.component';

describe('UsuariosFormdirectComponent', () => {
  let component: UsuariosFormdirectComponent;
  let fixture: ComponentFixture<UsuariosFormdirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuariosFormdirectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosFormdirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
