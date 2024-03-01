import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuOpcionComponent } from '../menu-opcion/menu-opcion.component';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MenuOpcionComponent ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  @Input() menuMin:boolean = false;
  @Input() mobile:boolean = false;
  @Output() menuClickEvent = new EventEmitter();
  @Output() menuIndexEvent = new EventEmitter();
  @Output() menuActivarEvent = new EventEmitter();

  @Input() listaOpciones: any[] =[];

  goRoute(indice:number):void{
    //this.store.dispatch(actions.seleccionarOpcionMenuIndice({indice:indice}));
    //console.log(indice);
    this.menuClickEvent.emit(true);
    this.menuIndexEvent.emit(indice);
  }
  clickActivarEvent(id:number){
    //console.log("emit recibido y enviado ",id);
    this.menuActivarEvent.emit(id);

  }
}
