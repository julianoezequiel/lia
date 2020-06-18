import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroMateriaisComponent } from './cadastro-materiais.component';

describe('CadastroMateriaisComponent', () => {
  let component: CadastroMateriaisComponent;
  let fixture: ComponentFixture<CadastroMateriaisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastroMateriaisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroMateriaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
