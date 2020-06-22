import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroEntradasComponent } from './cadastro-entradas.component';

describe('CadastroEntradasComponent', () => {
  let component: CadastroEntradasComponent;
  let fixture: ComponentFixture<CadastroEntradasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastroEntradasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroEntradasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
