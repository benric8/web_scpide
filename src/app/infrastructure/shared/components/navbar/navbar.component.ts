import { Component,  OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import {  faUser , faUserTie, faUserShield ,faUserCog } from '@fortawesome/free-solid-svg-icons';
import { LocalStorageUsuarioService } from 'src/app/infrastructure/services/local/local-storage-usuario.service';
import { Usuario } from 'src/app/domain/dto/LoginResponse.dto';

import { CommonModule } from '@angular/common';

import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,
    OverlayPanelModule,
    MenuModule,
    ButtonModule,
    FontAwesomeModule,
    RippleModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() profile:boolean = false;
  @Output() sidebarEvent = new EventEmitter();
  @Output() drawableEvent = new EventEmitter();

  sidebarShow:boolean = false;
  drawableShow:boolean = false;

  itemsEnd: MenuItem[]=[];
  nomUsuario: string;
  correoUsuario:string;
  perfilUsuario:string;
  title:string ="";
  faUser = faUser;
  faUserTie = faUserTie;
  faUserShield = faUserShield;
  faUserCog = faUserCog;
  
  dataUsuario:Usuario;
  dataPerfil:any;
  constructor(private localStorageUsuarioService: LocalStorageUsuarioService) { 
    this.dataUsuario = this.localStorageUsuarioService.getUsuario();
    //this.dataPerfil = this.localStorageUsuarioService.getPerfil();
    this.nomUsuario = '';
    this.correoUsuario = '';
    this.perfilUsuario = '';
  }

  ngOnInit(): void {
    if(this.dataUsuario){
      //console.log(this.dataUsuario);
    }
    if(this.dataPerfil){
      //console.log(this.dataPerfil);
    }

    this.itemsEnd = [
      {
        separator:true
      },
      {
          label:'Cambiar contraseña',
          icon:'pi pi-lock',
          styleClass:"menu-profile-item p-ripple",
          routerLink: ['/autenticacion/cambiar-contrasenia'],
          routerLinkActiveOptions: { exact: true },
      },
      {
        separator:true
      },
      {
          label:'Salir',
          icon:'pi pi-sign-out',
          styleClass:"menu-profile-item p-ripple",
          routerLink: ['/autenticacion/login'],
          routerLinkActiveOptions: { exact: true },
          
      }            
    ];
  }
  toggleSidebar(event:any):void{
    //console.log(console.log(event));
    this.sidebarShow = !this.sidebarShow;
    this.sidebarEvent.emit(this.sidebarShow);
  }
  
  toggleDrawable(event:any):void{
    //console.log(console.log(event));
    //this.drawableShow = !this.drawableShow;
    this.drawableEvent.emit(true);
  }
}
