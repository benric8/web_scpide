import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import * as actions from '../../../../global-store/cp.actions';
import { AppCpState } from '../../../../global-store/cp.reducers';
import Swal from 'sweetalert2';
import { BusquedaService } from 'src/app/infrastructure/services/remote/busqueda.service';
import { LocalStorageUsuarioService } from 'src/app/infrastructure/services/local/local-storage-usuario.service';
import { SelectItem } from 'primeng/api';
import { constantes } from 'src/app/constants';
import { BuscarUsuariosResponse, ListarComboPerfiles, ValidarDocIdentidadResponse } from 'src/app/domain/dto/ProcesosResponse.dto';
import { GenericResponse } from 'src/app/domain/dto/BaseResponse,dto';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent {
  filtro:any={};
  listaUsuarios:any[]=[];
  usuarioRegistro:any={};

  perfiles: SelectItem[] =[];
  estados: SelectItem[] = [];
  documento: any = {};
  mensajeDialog: string = '';

  onEditarUser:boolean=false;
  dialogRegistroUsuario:boolean=false;
  portada:boolean=true;
  error:boolean=false;
  display_sidebar:boolean=false;
  btn_panel_filter:boolean=false;
  submittedDNI:boolean=false;
  submitted:boolean=false;
  validate:boolean=false;

  hoy:Date = new Date();
  fechaDesdeMin:Date = new Date("January 01, 2021 00:00:00");
/*   fechaDesde:Date = new Date();
  fechaHasta:Date = new Date();
  fechaHastaMax:Date = new Date(); */
   fechaDesde:Date = new Date(new Date().getFullYear(), 0, 1);
  fechaHasta:Date = new Date(this.hoy.getTime() + (24 * 60 * 60 * 1000));
  fechaHastaMax:Date = new Date(this.hoy.getTime() + (24 * 60 * 60 * 1000)); 

  UsuarioSeleccionado:any;
  constructor(private store: Store<AppCpState>,
    private LocalStorageUsuarioService: LocalStorageUsuarioService, private busquedaService: BusquedaService){
    this.store.dispatch(actions.seleccionarOpcionMenu({url:"/mantenimientos/usuarios"}));
    //--
    this.filtro= {idPerfil:null, usuario:"", estado:"1"};
  }
  ngOnInit(): void {

    

    this.cargarPerfiles();
    //CARGAR COMBO ESTADOS
    this.estados = [
      {label: 'Activo', value: '1'},
      {label: 'Inactivo', value: '0'}
    ];
    this.limpiarfiltro();
    this.buscarUsuarios(this.filtro);

  }

  limpiarfiltro(){
    this.filtro = {idPerfil:null, usuario:"", estado:"1"};
  }

  buscarUsuarios(user: any){
    this.busquedaService.listarUsuarios(user).subscribe({
      next:(data:BuscarUsuariosResponse)=>{
        if(data != null){
          if(data.codigo === constantes.RES_COD_EXITO) {
            if(data.data.list.length > 0){
                this.listaUsuarios = data.data.list;   
                //console.log( this.listaUsuarios);            
                //cargar cuota y estado
                //this.solicitud.cuotaCambio = data.data.list[0].cuotaAsignada;
                //this.permisoEncontrado=true;
            }else{
              Swal.fire('Info!', 'No se encontraron resultados!' , 'info');
              //this.permisoEncontrado=false;
            }
          } else {
            Swal.fire('Atención!', data.descripcion+ '\n Código de Operación:'+ data.codigoOperacion, 'info');
            //this.permisoEncontrado=false;
          }
        }
      },
      complete:()=>{
      },
      error:(err)=>{
        Swal.fire('Atención!', err, 'warning');
        this.store.dispatch(actions.mostrarCargando({ estado: false}));
      }
    }); 
  }

  cargarPerfiles(){
    this.perfiles = [];
    this.busquedaService.listarPerfilesUsuarios().subscribe({
      next:(data:ListarComboPerfiles)=>{
        if(data != null){
          if(data.codigo === constantes.RES_COD_EXITO) {
            if(data.data.length > 0){
                let lista = data.data;
                //console.log(lista);
                for(var i=0;i<lista.length;i++){
                  this.perfiles.push({value: lista[i].idPerfil, label: lista[i].nombrePerfil});
                }
            }    
          }
        }
      },
      complete:()=>{
      },
      error:(err)=>{
        Swal.fire('Atención!', err, 'warning');
        this.store.dispatch(actions.mostrarCargando({ estado: false}));
      }
    });   
    //this.filtro.idEstadoSolicitud = 1;
  }

  limpiarNombres(){
    this.usuarioRegistro.apellidosNombres = '';
  }

  validarDocumento(event:any){
    this.submittedDNI=true;
    if(this.documento.nroDocumento !==null && this.documento.nroDocumento!==undefined && this.documento.nroDocumento!==""){
      this.busquedaService.validarDocumentoIdentidad(this.documento).subscribe({
        next:(data:ValidarDocIdentidadResponse )=>{
          //console.log(data);
          if(data.data.nroDocumento!==null && data.data.nroDocumento!==undefined && data.data.nroDocumento!==""){
            this.submittedDNI=false;
            //console.log(data.data);
            this.usuarioRegistro.apellidosNombres = data.data.apellidoPaterno + " " + data.data.apellidoMaterno + " " + data.data.nombres;
            this.usuarioRegistro.usuario = this.documento.nroDocumento;
          /*  this.solicitud.nombreSolicitante = data.data.apellidoPaterno + " " + data.data.apellidoMaterno + ", " + data.data.nombres;
            this.solicitud.nroDocumentoSolicitante = this.documento.nroDocumento; */
          }else {
            this.submittedDNI=false;
            /* this.solicitud.nombreSolicitante = '';
            this.solicitud.nroDocumentoSolicitante=''; */
            Swal.fire('Info!', data.data.respuestaReniec , 'info');
          }
        },
        complete:()=>{
        },
        error:(err)=>{
          this.store.dispatch(actions.mostrarCargando({ estado: false}));
          Swal.fire('Atención!', err, 'warning');
        }
      });
    }    
  }

  saveUsuario(){

    this.submitted=true;
    this.validate=true;

    if(this.usuarioRegistro.idPerfil ===null|| this.usuarioRegistro.idPerfil ===undefined|| this.usuarioRegistro.idPerfil ===""){
      this.usuarioRegistro.idPerfil = null;
      this.validate = false;
    }

    if(this.documento.nroDocumento ===null|| this.documento.nroDocumento ===undefined|| this.documento.nroDocumento ===""){
      this.usuarioRegistro.usuario = null;
      this.validate = false;
    }else{
      this.usuarioRegistro.usuario = this.documento.nroDocumento;
    }

    
    if(this.usuarioRegistro.apellidosNombres ===null|| this.usuarioRegistro.apellidosNombres ===undefined|| this.usuarioRegistro.apellidosNombres ===""){
      this.usuarioRegistro.apellidosNombres = null;
      this.validate = false;
    }

    if(this.validate){
        
        if(this.onEditarUser){
          Swal.fire({
            title: '¿Esta seguro de guardar los cambios realizados?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Si',
            denyButtonText: `Cancelar`,
            confirmButtonColor: 'brown',
            denyButtonColor: 'brown'
          }).then((result) => {
            if (result.isConfirmed) {
              this.store.dispatch(actions.mostrarCargando({ estado: true}));      
              try{
                this.busquedaService.editUsuario(this.usuarioRegistro).subscribe({
                  next:(data:GenericResponse)=>{
                    if(data != null){
                      if(data.codigo === constantes.RES_COD_EXITO) {
                          Swal.fire('Hecho!', 'Usuario modificado correctamente' , 'success'); 
                          this.limpiarfiltro();
                          this.buscarUsuarios(this.filtro);
                          this.dialogRegistroUsuario =false;
                          this.store.dispatch(actions.mostrarCargando({ estado: false}));      
                      } else {
                        Swal.fire('Atención!', data.descripcion+ '\n Código de Operación:'+ data.codigoOperacion, 'info');
                        this.store.dispatch(actions.mostrarCargando({ estado: false})); 
                      }
                    } 
                  },
                  complete:()=>{
                  },
                  error:(err)=>{
                    Swal.fire('Atención!', err, 'warning');
                    this.store.dispatch(actions.mostrarCargando({ estado: false}));
                  }
                });       
                } catch (error) {
                  this.error = true;
                  this.store.dispatch(actions.mostrarCargando({ estado: false})); 
                }
            } else if (result.isDenied) {
              this.store.dispatch(actions.mostrarCargando({ estado: false})); 
            }
          });
        } else{
          this.usuarioRegistro.activo = "1";
          this.usuarioRegistro.clave = "123456";
          Swal.fire({
            title: '¿Esta seguro de registrar este usuario?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Si',
            denyButtonText: `Cancelar`,
            confirmButtonColor: 'brown',
            denyButtonColor: 'brown'
          }).then((result) => {
            if (result.isConfirmed) {
              this.store.dispatch(actions.mostrarCargando({ estado: true}));      
              try{
                this.busquedaService.saveUsuario(this.usuarioRegistro).subscribe({
                  next:(data:GenericResponse)=>{
                    if(data != null){
                      if(data.codigo === constantes.RES_COD_EXITO) {
                          Swal.fire('Hecho!', 'Usuario registrado correctamente' , 'info'); 
                          this.limpiarfiltro();
                          this.buscarUsuarios(this.filtro);
                          this.dialogRegistroUsuario =false;
                          this.store.dispatch(actions.mostrarCargando({ estado: false}));       
                      } else {
                        Swal.fire('Atención!', data.descripcion+ '\n Código de Operación:'+ data.codigoOperacion, 'info');
                        this.store.dispatch(actions.mostrarCargando({ estado: false})); 
                      }
                    } 
                  },
                  complete:()=>{
                  },
                  error:(err)=>{
                    Swal.fire('Atención!', err, 'warning');
                    this.store.dispatch(actions.mostrarCargando({ estado: false}));
                  }
                });       
                } catch (error) {
                  this.store.dispatch(actions.mostrarCargando({ estado: false}));
                  this.error = true;
                }
            } else if (result.isDenied) {
              Swal.fire('No se realizó el registro de la solicitud', '', 'info')
            }
          });
        }
    }
  }

  agregarUsuario(){
    this.usuarioRegistro.idPerfil=null;
    this.usuarioRegistro.usuario="";
    this.usuarioRegistro.apellidosNombres="";
    this.documento.nroDocumento="";
    this.usuarioRegistro.activo = "1";
    this.usuarioRegistro.clave = "123456";
    this.mensajeDialog = 'Registrar Usuario';
    this.submitted=false;
    this.onEditarUser=false;
    this.dialogRegistroUsuario =true;
  }

  editarUsuario(item: any){
    //console.log(item);
    this.usuarioRegistro.idPerfil=item.idPerfil;
    this.usuarioRegistro.usuario=item.usuario;
    this.documento.nroDocumento=item.usuario;
    this.usuarioRegistro.apellidosNombres=item.apellidosNombres;
    item.activo==="Activo"?this.usuarioRegistro.activo="1":this.usuarioRegistro.activo="0"; 
    this.mensajeDialog = 'Modificar Usuario';
    this.submitted=false;
    this.onEditarUser=true;
    this.dialogRegistroUsuario =true;
  }

  reestablecerPassword(item: any){
    let idUsuario = item.idUsuario;
    Swal.fire({
      title: '¿Esta seguro de reestablecer la contraseña de este usuario?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
      confirmButtonColor: 'brown',
      denyButtonColor: 'brown'
    }).then((result) => {
      if (result.isConfirmed) {   
        this.store.dispatch(actions.mostrarCargando({ estado: true}));   
        try{
          this.busquedaService.reestablecerContr(idUsuario).subscribe({
            next:(data:GenericResponse)=>{
              if(data != null){
                if(data.codigo === constantes.RES_COD_EXITO) {
                  //console.log(data);
                  /* this.submitted=false;
                  this.ipsvacias = false;
                  this.store.dispatch(actions.mostrarCargando({ estado: false}));
                  this.route.navigate(['/buscar-evaluacion'], {relativeTo: this.activatedRoute});   */ 
                    Swal.fire('Hecho!', 'Contraseña reestablecida correctamente' , 'success'); 
                    this.store.dispatch(actions.mostrarCargando({ estado: false}));
                    /* this.limpiarfiltro();
                    this.buscarUsuarios(this.filtro);
                    this.dialogRegistroUsuario =false;  */     
                } else {
                  /* this.ipsvacias = false;
                  this.submitted=false; */
                  Swal.fire('Atención!', data.descripcion+ '\n Código de Operación:'+ data.codigoOperacion, 'info');
                  this.store.dispatch(actions.mostrarCargando({ estado: false}));
                }
              } else {
                this.store.dispatch(actions.mostrarCargando({ estado: false}));
              }
            },
            complete:()=>{
            },
            error:(err)=>{
              Swal.fire('Atención!', err, 'warning');
              this.store.dispatch(actions.mostrarCargando({ estado: false}));
            }
          });       
          } catch (error) {
            this.store.dispatch(actions.mostrarCargando({ estado: false}));
            this.error = true;
          }
      } else if (result.isDenied) {
        Swal.fire('No se realizó el registro de la solicitud', '', 'info')
      }
    });
  }

  hideDialogUsuario(){
    this.dialogRegistroUsuario=false;
  }

  show_btn_panel():void{
    this.btn_panel_filter =true;
  }
  hide_btn_panel():void{
    this.btn_panel_filter =false;
  }

  fechaDesdeSeleccionado(event:any){
    //  this.fechaHastaMax = this.maxFecha(event);
    //    this.fechaHasta = this.fechaHastaMax;
      //console.log(event);
      this.fechaDesde = event;
    }
}
