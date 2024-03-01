import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as actions from '../../../../global-store/cp.actions';
import { AppCpState } from '../../../../global-store/cp.reducers';

import { BusquedaService } from 'src/app/infrastructure/services/remote/busqueda.service';
import { LocalStorageUsuarioService } from 'src/app/infrastructure/services/local/local-storage-usuario.service';
import { DetalleSolicitud, EvaluarSolicitud, Entidad, OperacionCombo } from 'src/app/domain/dto/ProcesosRequest.dto';
import { FiltroBusquedaSolicitud } from 'src/app/domain/dto/ProcesosRequest.dto';
import Swal from 'sweetalert2';
import { constantes, mensajes } from 'src/app/constants';
import { SelectItem } from 'primeng/api';
import { GenericResponse } from 'src/app/domain/dto/BaseResponse,dto';
import { BuscarDetalleSolicitudResponse, BuscarSolicitudesResponse, EntidadesSugerenciasResponse, EstadosSolicitudResponse, OperacionesComboResponse } from 'src/app/domain/dto/ProcesosResponse.dto';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit {
  /*filtroVictimas: VictimaBuscarRequest ={
    activo:"1",
    usuario:"",
    documentoIdentidad:"",
    primerApellido: "",
    segundoApellido: "",
    operador:"",
    codigoDistritoJudicial:""
  }*/
  filtro: FiltroBusquedaSolicitud;
  hoy:Date = new Date();
  //----
  
  solicitudes: any[] = [];
  SolicitudSeleccionada: any={};
  rq: any = {};
  rqSelecionado: any = {};
  evaluacion:EvaluarSolicitud;

  nomUsuario: string = '';
  perfilUsuario: number = 0;

  solicitudDetallado: DetalleSolicitud;

  esServiceDesk: boolean=true;
  validate:boolean=true;
  portada:boolean=false;
  error:boolean=false;
  dialogDetalle:boolean=false;
  cambioEstado:boolean=false;
  cambioCuota:boolean=false;
  cambioListaIps:boolean=false;
  //---- FILTROS
  estados: SelectItem[] = [];
  listaOperaciones: OperacionCombo[] = [];
  listaEntidades: Entidad[]=[];
  entidadSeleccionada: Entidad | null;
  dataEntidad:boolean=true;
  flagbuscarlista:boolean=false;
  fechaDesdeMin:Date = new Date("January 01, 2010 00:00:00");
  fechaDesde:Date = new Date(new Date().getFullYear(), 0, 1);
  fechaHasta:Date = new Date();
  fechaHastaMax:Date = new Date();
  //---
  constructor(private store: Store<AppCpState>,
    private route: Router,private activatedRoute: ActivatedRoute ,private busquedaService: BusquedaService, private localStorageUsuarioService: LocalStorageUsuarioService) {
    this.store.dispatch(actions.seleccionarOpcionMenu({url:"/procesos/solicitudes"}));
    //--
    this.SolicitudSeleccionada = null;
    this.evaluacion = {
      idSolicitud: null,
      usuarioAprobo: '',
      idEstadoSolicitud: null
    };
    this.solicitudDetallado = {
      idSolicitud: null,
      nombreTipoSolicitud: '',
      idEstadoSolicitud: 0,
      idTipoSolicitud: 0,
      usuarioRegistro: '',
      solicitante: '',
      usuarioEvaluo: '',
      justificacion: '',
      estadoCambio: '',
      cuotaCambio: null,
      estadoActual: '',
      cuotaActual: null,
      fechaRegistro: '',
      fechaEvaluacion: '',
      listaIpSolicitud: null
    };
    this.solicitudes=[];
    this.portada=true;
    //---
    this.hoy = new Date();
    const d1= new Date(new Date().getFullYear(), 0, 1);
    const d2 = new Date(this.hoy.getTime() + (24 * 60 * 60 * 1000));
    this.filtro = {
      idSolicitud: null,
      idEntidad: null,
      idOperacion: null,
      idEstadoSolicitud: 1,
      fechaDesde: d1,
      fechaHasta: d2
    };
    //--
    this.listaEntidades=[];
    this.entidadSeleccionada = null;
  }

  ngOnInit(): void {
    this.solicitudes=[];
    this.portada=true;
    this.cargarSolicitudesLista();
    this.cargarUsuario();
    
    //---
    this.buscarEvaluacion(this.filtro);
    this.cargarListaOperaciones();
    
    this.cargarEstados();
  }

  cargarSugerenciasEntidad(event:any){
    let cadena:string ="";
    if(event.query==null||event.query==undefined||event.query==""){
      cadena = "";
    } else {
      cadena = event.query.toString().trim();
    }
    if(cadena!="") {
      this.busquedaService.recuperarEntidadesSugeridas(cadena).subscribe({
        next:(data:EntidadesSugerenciasResponse )=>{
          if(data != null){
            if(data.codigo === constantes.RES_COD_EXITO) {
              if(data.data.length > 0){
                  this.listaEntidades  = data.data;
              }    
            }
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

cargarListaOperaciones(){
  this.listaOperaciones = [];
  this.busquedaService.recuperarlistaOperacion().subscribe({
    next:(data:OperacionesComboResponse )=>{
      if(data != null){
        if(data.codigo  === constantes.RES_COD_EXITO) {
              this.listaOperaciones = data.data;
        }
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

cargarEstados(){
  this.estados = [];
  this.busquedaService.listarEstadosSolicitud().subscribe({
    next:(data:EstadosSolicitudResponse )=>{
      if(data != null){
        if(data.codigo  === constantes.RES_COD_EXITO) {
          if(data.data.length > 0){
              let lista = data.data;
              for(var i=0;i<lista.length;i++){
                this.estados.push({value: lista[i].idEstadoSolicitud, label: lista[i].nombre});
              }
          }    
        }
      }
    },
    complete:()=>{
    },
    error:(err)=>{
      this.store.dispatch(actions.mostrarCargando({ estado: false}));
      Swal.fire('Atención!', err, 'warning');
    }
  });   
  this.filtro.idEstadoSolicitud = 1;
}

/*   addDays(date:Date, days:number):Date {
  let copy:Date = new Date(Number(date))
  copy.setDate(date.getDate() + days)
  return copy
}
maxFecha(date:Date):Date{// con un año de rango
  let max:Date = this.addDays(date,365);
  if(this.hoy < max)
    max = this.hoy;
  return max;
} */
fechaDesdeSeleccionado(event:any){
//  this.fechaHastaMax = this.maxFecha(event);
//    this.fechaHasta = this.fechaHastaMax;
  this.fechaDesde = event;
}

check_NroSolicitud(event:any):void{
  if (event.target.value < 0) {
    event.target.value = 0;
  }
}

consultarSolicitudes():void{
  if(this.entidadSeleccionada==null||this.entidadSeleccionada==undefined||this.entidadSeleccionada.razonSocial==""){
    this.filtro.idEntidad = 0;
  } else {
    this.filtro.idEntidad = this.entidadSeleccionada.idEntidad;
  }
  this.buscarEvaluacion(this.filtro);
}

  buscarEvaluacion(filtro:FiltroBusquedaSolicitud) {
    this.error = false;
    this.portada = true;
    //console.log("filtro",filtro)
    this.store.dispatch(actions.mostrarCargando({ estado: true}));
    try {
      this.busquedaService.buscarSolicitudes({ ...filtro }).subscribe({
        next:(data:BuscarSolicitudesResponse )=>{
          if(data != null){
            if(data.codigo === constantes.RES_COD_EXITO) {
              this.portada = false;
              //this.requisitorias = data.data;
              // data ok
              /* if(this.requisitorias && this.requisitorias.length > 0) {
                this.rq = this.requisitorias[0];
                this.rqSelecionado = {...this.rq};
              } */
              //console.log(data.data.list);
              this.solicitudes = data.data.list;
              this.store.dispatch(actions.mostrarCargando({ estado: false}));
              if(data.data.list.length==0){
                Swal.fire('Atención!', mensajes.MSG_RESP_NOT_DATA_LIST, 'info');
              }

            } else {
              this.store.dispatch(actions.mostrarCargando({ estado: false}));
              Swal.fire('Atención!', data.descripcion+ '\n Código de Operación:'+ data.codigoOperacion, 'info');
              
            }
          } else {
            this.store.dispatch(actions.mostrarCargando({ estado: false}));
            Swal.fire('Atención!', mensajes.MSG_RESP_NOT_DATA, 'info');
          }
        },
        complete:()=>{
        },
        error:(err)=>{
          this.store.dispatch(actions.mostrarCargando({ estado: false}));
          Swal.fire('Atención!', err, 'warning');
        }
      });       
    } catch (error) {
      this.store.dispatch(actions.mostrarCargando({ estado: false}));
      this.error = true;
    }
  }




  cargarSolicitudesLista(){
    /*this.store.select('cargarListaSolicitudes').subscribe(({ lista }) => {
      //console.log("lista-list",lista)
      if(lista) {
          this.solicitudes = lista;
          this.solicitudes.length>0?this.portada=false:this.portada=true;
      } else {
          this.solicitudes=[];
      }
    });*/
  }

  cargarUsuario(){
    this.esServiceDesk = this.localStorageUsuarioService.esServiceDesk();
    let usuario = this.localStorageUsuarioService.getUsuario();
    if(usuario != null) {
        this.nomUsuario = usuario.usuario;
        this.perfilUsuario = usuario.idPerfil;
    }
  }
 
  buscarDetalle(item: any){
    this.solicitudDetallado = {
      idSolicitud: null,
      nombreTipoSolicitud: '',
      idEstadoSolicitud: 0,
      idTipoSolicitud: 0,
      usuarioRegistro: '',
      solicitante: '',
      usuarioEvaluo: '',
      justificacion: '',
      estadoCambio: '',
      cuotaCambio: null,
      estadoActual: '',
      cuotaActual: null,
      fechaRegistro: '',
      fechaEvaluacion: '',
      listaIpSolicitud: null
    };
    this.dialogDetalle = true;
    this.cambioEstado=false;
    this.cambioCuota=false;
    this.cambioListaIps=false;

    var nroSolicitud = 0;
    if(item.idSolicitud ==null||item.idSolicitud==undefined|| item.idSolicitud==""){
      nroSolicitud = 0;
    }else{
      nroSolicitud = item.idSolicitud;
    }    
    this.busquedaService.buscarDetalleSolicitud(nroSolicitud).subscribe({
      next:(data:BuscarDetalleSolicitudResponse )=>{
        if(data != null){
          if(data.codigo === constantes.RES_COD_EXITO) {
                this.solicitudDetallado = data.data;

                if(this.solicitudDetallado.estadoActual===null||this.solicitudDetallado.estadoActual===undefined||this.solicitudDetallado.estadoActual===''){
                    this.solicitudDetallado.estadoActual ='';
                }
                if(this.solicitudDetallado.cuotaActual===null||this.solicitudDetallado.cuotaActual===undefined||this.solicitudDetallado.cuotaActual===0){
                  this.solicitudDetallado.cuotaActual =null;
                }
                if(this.solicitudDetallado.usuarioEvaluo===null||this.solicitudDetallado.usuarioEvaluo===undefined||this.solicitudDetallado.usuarioEvaluo===''){
                  this.solicitudDetallado.usuarioEvaluo = '';
                }
                if(this.solicitudDetallado.fechaEvaluacion===null||this.solicitudDetallado.fechaEvaluacion===undefined||this.solicitudDetallado.fechaEvaluacion===''){
                  this.solicitudDetallado.fechaEvaluacion = '';
                }
                ////////
                if(this.solicitudDetallado.estadoCambio!==null&&this.solicitudDetallado.estadoCambio!==undefined&&this.solicitudDetallado.estadoCambio!==''){
                  this.cambioEstado=true;
                }
                if(this.solicitudDetallado.cuotaCambio!==null&&this.solicitudDetallado.cuotaCambio!==undefined&&this.solicitudDetallado.cuotaCambio!==0){
                  this.cambioCuota=true;
                } 
                if(this.solicitudDetallado.listaIpSolicitud!==null&&this.solicitudDetallado.listaIpSolicitud!==undefined&&this.solicitudDetallado.listaIpSolicitud.length!==0){
                  for(let element of this.solicitudDetallado.listaIpSolicitud){
                    element.activo = element.activo==='1'?'Activo':'Inactivo';
                  }
                  this.cambioListaIps=true;
                }
                
                //console.log('DETALL DE SOLICITUD: ',this.solicitudDetallado);
          }
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

  hideDetalle(){
    this.dialogDetalle = false;
  }

  nuevaSolicitud(){
    this.route.navigate(['/solicitud-permiso']);
  }

  aprobarSolicitud(){
    this.error = false;
    this.portada = false;
    this.validate = true;

    if(this.SolicitudSeleccionada.idSolicitud ==null||this.SolicitudSeleccionada.idSolicitud==undefined|| this.SolicitudSeleccionada.idSolicitud==""){
      this.evaluacion.idSolicitud = null;
      this.validate = false;
    }else{
      this.evaluacion.idSolicitud = this.SolicitudSeleccionada.idSolicitud;
    }

    if(this.nomUsuario ==null || this.nomUsuario==undefined || this.nomUsuario==""){
      this.evaluacion.usuarioAprobo = '';
      this.validate = false;
    }else{
      this.evaluacion.usuarioAprobo = this.nomUsuario;
    }

    this.evaluacion.idEstadoSolicitud = 2;   
    if(this.validate){

      Swal.fire({
        title: '¿Esta seguro de aprobar la solicitud??',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Aceptar',
        denyButtonText: `Cancelar`,
        confirmButtonColor: 'brown',
        denyButtonColor: 'brown'
      }).then((result) => {
        if (result.isConfirmed) {
          this.store.dispatch(actions.mostrarCargando({ estado: true}));
          try {
            this.busquedaService.evaluarSolicitud({ ...this.evaluacion }).subscribe({
              next:(data:GenericResponse)=>{
              if(data != null){
                if(data.codigo === constantes.RES_COD_EXITO) {
                  this.portada = false;
                  Swal.fire('Hecho!', 'Solicitud Aprobada Correctamente!' , 'success');
/*                   this.cargarLista();
                  let lista = this.solicitudes;
                  this.store.dispatch(actions.cargarLista({lista: [...lista ]}));
                  this.store.dispatch(actions.mostrarCargando({ estado: false}));   */ 
                  
                  //this.route.navigate(['/buscar-evaluacion'],{relativeTo: this.activatedRoute});
                  this.store.dispatch(actions.mostrarCargando({ estado: false}));
                } else {
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
          Swal.fire('No se hizo cambios a la solicitud', '', 'info')
        }
      });      
    }  

  }

  rechazarSolicitud(){
    this.error = false;
    this.portada = false;
    this.validate = true;

    if(this.SolicitudSeleccionada.idSolicitud ==null||this.SolicitudSeleccionada.idSolicitud==undefined|| this.SolicitudSeleccionada.idSolicitud==""){
      this.evaluacion.idSolicitud = null;
      this.validate = false;
    }else{
      this.evaluacion.idSolicitud = this.SolicitudSeleccionada.idSolicitud;
    }

    if(this.nomUsuario ==null || this.nomUsuario==undefined || this.nomUsuario==""){
      this.evaluacion.usuarioAprobo = '';
      this.validate = false;
    }else{
      this.evaluacion.usuarioAprobo = this.nomUsuario;
    }
    
    this.evaluacion.idEstadoSolicitud = 3;   

    if(this.validate){
      Swal.fire({
        title: '¿Esta seguro de rechazar la solicitud??',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Aceptar',
        denyButtonText: `Cancelar`,
        confirmButtonColor: 'brown',
        denyButtonColor: 'brown'
      }).then((result) => {
        if (result.isConfirmed) {
          this.store.dispatch(actions.mostrarCargando({ estado: true}));      
          try {
            this.busquedaService.evaluarSolicitud({ ...this.evaluacion }).subscribe({
              next:(data:GenericResponse )=>{
                if(data != null){
                  if(data.codigo === constantes.RES_COD_EXITO) {
                    this.portada = false;
                    //this.requisitorias = data.data;
                    // data ok
                    /* if(this.requisitorias && this.requisitorias.length > 0) {
                      this.rq = this.requisitorias[0];
                      this.rqSelecionado = {...this.rq};
                    } */
                    //console.log(data.data.list);
                    Swal.fire('Hecho!', 'Solicitud Rechazada Correctamente!' , 'success');
  /*                  this.cargarLista();
                    let lista = this.solicitudes;
                    this.store.dispatch(actions.cargarLista({lista: [...lista ]}));
                    this.store.dispatch(actions.mostrarCargando({ estado: false}));  */
                    
                    //this.route.navigate(['/buscar-evaluacion/lista'], {relativeTo: this.activatedRoute});
                    this.store.dispatch(actions.mostrarCargando({ estado: false}));

                  } else{
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
                this.store.dispatch(actions.mostrarCargando({ estado: false}));
                Swal.fire('Atención!', err, 'warning');
              }
            });       
          } catch (error) {
            this.store.dispatch(actions.mostrarCargando({ estado: false}));
            this.error = true;
          }
        } else if (result.isDenied) {
          Swal.fire('No se hizo cambios a la solicitud', '', 'info')
        }
      });     
    }  
  }
}
