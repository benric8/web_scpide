import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarContraseniaComponent } from './cambiar-contrasenia.component';

describe('CambiarContraseniaComponent', () => {
  let component: CambiarContraseniaComponent;
  let fixture: ComponentFixture<CambiarContraseniaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CambiarContraseniaComponent]
    });
    fixture = TestBed.createComponent(CambiarContraseniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
