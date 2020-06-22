import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaSaidasComponent } from './lista-saidas.component';

describe('ListaSaidasComponent', () => {
  let component: ListaSaidasComponent;
  let fixture: ComponentFixture<ListaSaidasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaSaidasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaSaidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
