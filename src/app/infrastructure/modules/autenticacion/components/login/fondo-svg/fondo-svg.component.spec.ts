import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FondoSvgComponent } from './fondo-svg.component';

describe('FondoSvgComponent', () => {
  let component: FondoSvgComponent;
  let fixture: ComponentFixture<FondoSvgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FondoSvgComponent]
    });
    fixture = TestBed.createComponent(FondoSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
