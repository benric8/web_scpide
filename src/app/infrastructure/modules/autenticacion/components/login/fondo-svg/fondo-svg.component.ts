import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fondo-svg',
  templateUrl: './fondo-svg.component.html',
  styleUrls: ['./fondo-svg.component.scss']
})
export class FondoSvgComponent {
  @Input() colorPrimary:string = "#8b0000";
}
