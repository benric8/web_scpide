import { Injectable } from '@angular/core';
import { constantes, urlsGlobal } from 'src/app/constants';
import { Usuario } from 'src/app/domain/dto/LoginResponse.dto';
import { MenuOpcionesSistema, OpcionSistema } from 'src/app/domain/dto/OpcionesResponse.dto';
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageUsuarioService {
  public readonly USUARIO = constantes.USUARIO;
  public readonly USUARIO_OPCIONES = constantes.USUARIO_OPCIONES;
  public readonly USUARIO_PERFIL = constantes.USUARIO_PERFIL;
  public readonly USUARIO_URLS_PERMITIDO = constantes.USUARIO_URLS_PERMITIDO;

  constructor() { }

  setUsuario(usuario: Usuario) {
    localStorage.setItem(this.USUARIO, JSON.stringify(usuario))
  }

  setOpciones(opciones: MenuOpcionesSistema) {// opciones permitidas
    localStorage.setItem(this.USUARIO_OPCIONES, JSON.stringify(opciones))
  }

  setUrlsPermitidos(urls: string[]) {// opciones permitidas
    localStorage.setItem(this.USUARIO_URLS_PERMITIDO, JSON.stringify(urls))
  }

  setPerfil(perfiles: any) {// PERFIL
    localStorage.setItem(this.USUARIO_PERFIL, JSON.stringify(perfiles))
  }

  getUsuario() {
    let usuarioLocal:string|null =localStorage.getItem(this.USUARIO); 
    if(usuarioLocal) {
        return JSON.parse(usuarioLocal);
    } else {
        return null;
    }
  }
  getOpciones() {
    let opcionesLocal:string|null =localStorage.getItem(this.USUARIO_OPCIONES); 
    //console.log("opciones login services", opcionesLocal);
    if(opcionesLocal) {
        return JSON.parse(opcionesLocal);
    } else {
        return null;
    }
  }
  getUrlPermitidos() {
    let urlPermitidos:string|null =localStorage.getItem(this.USUARIO_URLS_PERMITIDO); 
    //console.log("opciones login services", opcionesLocal);
    if(urlPermitidos) {
        return JSON.parse(urlPermitidos);
    } else {
        return null;
    }
  }
  getPerfil() {
    let usuarioPerfil:string|null =localStorage.getItem(this.USUARIO_PERFIL); 
    if(usuarioPerfil) {
        return JSON.parse(usuarioPerfil);
    } else {
        return null;
    }
  }

  removeUsuario() {
    localStorage.removeItem(this.USUARIO);
    localStorage.removeItem(this.USUARIO_OPCIONES);
    localStorage.removeItem(this.USUARIO_PERFIL);
    localStorage.removeItem(this.USUARIO_URLS_PERMITIDO);
  }

  removeOpcion() {
    localStorage.removeItem(this.USUARIO_OPCIONES);
  }

  removeUrlsPermitidas() {
    localStorage.removeItem(this.USUARIO_URLS_PERMITIDO);
  }

  removePerfil() {
    localStorage.removeItem(this.USUARIO_PERFIL);
  }

  clear(){
    localStorage.clear(); 
  }
  //---
  esServiceDesk():boolean{
    let usuario = this.getUsuario();
    if(usuario != null) {
      return usuario.idPerfil ===1
    }
    return false;
  }

  verificarPermisos(url:string):boolean{
    //console.log("Verificar url", url);
    if(this.esUrlGlobal(url) || url ==='/'){
      return true;
    }
    let dataUrlsPermitidos:string[] = this.getUrlPermitidos();
    if(dataUrlsPermitidos && dataUrlsPermitidos.length>0 && this.existeOpcion(url,dataUrlsPermitidos)){
      return true;
    }
    return false;
  }
  
  existeOpcion(url:string, urls:string[]):boolean{
    console.log("opciones",urls);
    for(let i=0;i<urls.length;i++){
      if(urls[i] === url){
        return true;
      }
    }
    return false;
  }

  esUrlGlobal(url:string):boolean{
    //console.log("opciones",opciones);
    for(let i=0;i<urlsGlobal.length;i++){
      if(url.startsWith(urlsGlobal[i])){
        return true;
      }
    }
    return false;
  }
}
