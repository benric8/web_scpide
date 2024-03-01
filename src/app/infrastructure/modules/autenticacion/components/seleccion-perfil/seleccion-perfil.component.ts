import { Component, OnInit } from '@angular/core';
import {  faUser , faUserTie, faUserShield ,faUserCog, faL } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/infrastructure/services/remote/login.service';
import { LocalStorageService } from 'src/app/infrastructure/services/local/local-storage.service';
import { LocalStorageUsuarioService } from 'src/app/infrastructure/services/local/local-storage-usuario.service';
import { Usuario } from 'src/app/domain/dto/LoginResponse.dto';
import Swal from 'sweetalert2';

import { OpcionesRequest } from 'src/app/domain/dto/OpcionesRequest.dto';
import { MenuOpcion, MenuOpcionesSistema, OpcionesResponse, OpcionSistema } from 'src/app/domain/dto/OpcionesResponse.dto';

import { opciones } from './opciones'; 

import { Store } from '@ngrx/store';
import * as actions from '../../../../global-store/cp.actions';
import { AppCpState } from '../../../../global-store/cp.reducers';
import { constantes } from 'src/app/constants';

@Component({
  selector: 'app-seleccion-perfil',
  templateUrl: './seleccion-perfil.component.html',
  styleUrls: ['./seleccion-perfil.component.scss']
})
export class SeleccionPerfilComponent implements OnInit  {
  faUser = faUser;// usuario
  faUserTie = faUserTie; // usuario operador (perfiles nuevos)
  faUserShield = faUserShield; //usuario seguridad (perfil monitoreo)
  faUserCog = faUserCog; // usuario configuracion (perfil administtrador)

  listaPerfiles: any[] = [];
  perfilSeleccionado: any;
  /* listaPerfiles: any[] = [
    {id:"1",title:"Ciudadano",description:"una descripcion",select:false, icon:faUserCog},
    {id:"2",title:"Service Desk",description:"una descripcion segundo",select:false, icon:faUserTie},
    {id:"3",title:"Administrador",description:"una descripcion tercero",select:false, icon:faUserShield}
  ]; */

  dataUsuario:Usuario;
  reqOpciones: OpcionesRequest;
  esServiceDesk:boolean = false;
  constructor(private route: Router, 
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private localStorageService: LocalStorageService,
    private localStorageUsuarioService:LocalStorageUsuarioService,
    private store: Store<AppCpState>) {
    this.dataUsuario = this.localStorageUsuarioService.getUsuario();
    this.esServiceDesk = this.localStorageUsuarioService.esServiceDesk();
    //console.log(this.dataUsuario);
    this.reqOpciones = {
      usuario: "",
      idPerfil: 0,
      token: ""};
   }

  ngOnInit(): void {
    if(opciones){
      if(this.esServiceDesk){
        this.gererarMenuOpciones(opciones.opcionesServiceDesk.opciones);
      }
      else{
        this.gererarMenuOpciones(opciones.opciones.opciones);
      }
    }
    
    /*if(this.dataUsuario){
      this.dataUsuario.perfiles.forEach(
        
        perfil =>{
        this.listaPerfiles.push(
          {
            id :perfil.id,
            title: perfil.nombre,
            description: "",
            rol: perfil.rol,
            select:false,
            icon:this.getIcon(perfil.nombre)
          }
        )
      })

      if(this.listaPerfiles.length==1){
        this.perfilSeleccionado = this.listaPerfiles[0];
        this.ingresar();
      }
    }*/
    
  }

  getIcon(perfil:string){
    switch (perfil.toLowerCase()) {
      case 'administrador':
        return faUserCog;
      case 'monitoreador':
        return faUserShield;
      default:
        return faUserTie;
    }
  }
  
  ingresar():void{
    let tokenAut = this.localStorageService.getToken();
    if(tokenAut){ this.reqOpciones.token = tokenAut};
    this.reqOpciones.usuario = this.dataUsuario.usuario;
    if(this.perfilSeleccionado){
      this.store.dispatch(actions.mostrarCargando({ estado: true}));
      //let perfilSe: Perfil = this.perfilSeleccionado;
      this.reqOpciones.idPerfil = this.perfilSeleccionado.id;
      this.loginService.opciones({...this.reqOpciones}).subscribe({
        next:(data:OpcionesResponse)=>{
          //console.log("opciones ",data);
          if(data.codigo===constantes.RES_COD_EXITO){
            this.localStorageService.setToken(data.data.token);
            this.localStorageUsuarioService.setPerfil(this.perfilSeleccionado);
            this.gererarMenuOpciones(data.data.opciones.opciones);
            //this.route.navigate(["mantenimientos/victimas"]);
          }
          else{

            this.store.dispatch(actions.mostrarCargando({ estado: false}));
            Swal.fire('Atención!', data.descripcion, 'info');
            
          }
        },
        complete:()=>{
          //this.loginLoad = false;
          //this.store.dispatch(actions.mostrarCargando({ estado: false}));
        },
        error:(err)=>{
          this.store.dispatch(actions.mostrarCargando({ estado: false}));
          Swal.fire('Atención!', err, 'warning');
          this.route.navigate(['/autenticacion/login']);
        }
      });
      //this.loginService.setOpciones(perfilSe);
      //this.route.navigate([perfilSe.opciones[0].url], {relativeTo: this.activatedRoute});
    }
    else{
      Swal.fire('Atención!', "Seleccione un perfil antes de ingresar al sistema", 'warning');
    }
    
    
  }
  buscarHijos(responseOpciones:MenuOpcion[],id:number, uri:String):OpcionSistema[]{
      let menuHijos:OpcionSistema[] = [];
      let menuHijosHijos:OpcionSistema[] = [];

      let menu:OpcionSistema;
      for(let i = 0; i< responseOpciones.length; i++){
        if(responseOpciones[i].idOpcionSuperior == id){
          menuHijosHijos = this.buscarHijos(responseOpciones,responseOpciones[i].id,uri + responseOpciones[i].url );
          menu = {
            id: responseOpciones[i].id ,
            title: responseOpciones[i].nombre, 
            description: "",
            select: false,
            activate: false,
            icon: responseOpciones[i].icono,
            url: uri+responseOpciones[i].url,
            hijos: menuHijosHijos};
          menuHijos.push(menu);
        }
      }
      return menuHijos;
  }

  gererarMenuOpciones(responseOpciones:MenuOpcion[]):void{
    let menuPadres:OpcionSistema[] = [];
    let menuHijos:OpcionSistema[] = [];
    let menu:OpcionSistema;
    for(let i = 0; i< responseOpciones.length; i++){
      if(responseOpciones[i].idOpcionSuperior == null){
        menuHijos = this.buscarHijos(responseOpciones,responseOpciones[i].id,responseOpciones[i].url);
        menu = {
          id: responseOpciones[i].id,
          title: responseOpciones[i].nombre,
          description: "",
          select: false,
          activate: false,
          icon: responseOpciones[i].icono,
          url: responseOpciones[i].url,
          hijos: menuHijos
        };
        menuPadres.push(menu);
      }
    }
    //console.log("menu generado ",menuPadres);
    this.localStorageUsuarioService.setOpciones({opciones: menuPadres});
    let urlsPermitods = this.generarUrlsPermitidos(menuPadres);
    this.localStorageUsuarioService.setUrlsPermitidos(urlsPermitods);
    this.irPrimerUrl(menuPadres);
  }

  generarUrlsPermitidos(listaOps:OpcionSistema[]):string[]{
    let urlsP:string[] = [];
    for(let i =0;i<listaOps.length;i++){
      if(listaOps[i].hijos.length>0){
        urlsP = urlsP.concat(this.generarUrlsPermitidos(listaOps[i].hijos));
      }
      else{
        urlsP.push(listaOps[i].url);
      }
    }
    return urlsP;
  }
  irPrimerUrl(listaOps:OpcionSistema[]){
    for(let i =0;i<listaOps.length;i++){
      if(listaOps[i].hijos.length>0){
        this.irPrimerUrl(listaOps[i].hijos);
        break;
      }
      else{
        this.route.navigate([listaOps[i].url]);
        break;
      }
    }
  }
  selectedPerfil(indice:number, perfil:any):void{
    //console.log(item);
    this.listaPerfiles.forEach(function(element, index, array){
      element.select = false;
    });
    this.listaPerfiles[indice].select=true;
    this.perfilSeleccionado = perfil;
    //localStorage.setItem('perfil', this.listaPerfiles[indice].id);
  }

}
