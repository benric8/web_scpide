import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import * as actions from '../../../../global-store/cp.actions';
import { AppCpState } from '../../../../global-store/cp.reducers';
import { FiltroBusquedaPermisos, Entidad, OperacionCombo, RegistroSolicitud, IpModel, IpModel2, RegistroEntidad, ValidarDocumento } from 'src/app/domain/dto/ProcesosRequest.dto';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { BusquedaService } from 'src/app/infrastructure/services/remote/busqueda.service';
import { LocalStorageUsuarioService } from 'src/app/infrastructure/services/local/local-storage-usuario.service';
import { SelectItem } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { constantes } from 'src/app/constants';
import { BuscarPermisosResponse, ConsultaRucResponse, EntidadesSugerenciasResponse, ListarIpsEntidadResponse, ListarTipoSolicitudResponse, OperacionesComboResponse, ValidarDocIdentidadResponse } from 'src/app/domain/dto/ProcesosResponse.dto';
import { GenericResponse } from 'src/app/domain/dto/BaseResponse,dto';

@Component({
  selector: 'app-nueva-solicitud',
  templateUrl: './nueva-solicitud.component.html',
  styleUrls: ['./nueva-solicitud.component.scss']
})
export class NuevaSolicitudComponent implements OnInit{
  solicitud: RegistroSolicitud;
  //--
  filtroma: number = 1;
  tiposSol: SelectItem[] = [];
  ips: SelectItem[] = [];
  estados: SelectItem[] = [];

  listaIps: IpModel[]=[];
  busqPermiso: FiltroBusquedaPermisos;
  listaOperaciones: OperacionCombo[]=[];
  listaOperacionesAux: OperacionCombo[]=[];
  OperacionSeleccionada: OperacionCombo = {
    idOperacion: 0,
    nombre: '',
    descripcion: '',
    endPoint: '',
    cuotaDefecto: '',
    activo:''
  };

  registroEntidad:RegistroEntidad;
  validacionRuc: any={};
  itemSeleccionado: any={};
  nombreEntidad:string = '';
  nroIpsPermitidas:number = 0;
  cuotaMaxima:number = 0;

  listaEntidades: Entidad[]=[];
  entidadSeleccionada: Entidad;
  clonedIps: { [s: string]: IpModel; } = {};
  estadoSeleccionado: string;
  indexRowSeleccionada: number =0;

  hoy:Date = new Date();
  direccionIp:string='';
  estadoIp:string='';
  nomUsuario:string='';
  perfilUsuario:string='';

  dialogRegistroEntidad:boolean=false;
  dialogRegistroIps:boolean=false;
  error:boolean=false;
  validate:boolean=true;
  permisoEncontrado:boolean=false;
  onEditarIp:boolean=false;
  onEditarIpNueva:boolean=false;
  submitted:boolean=false;
  submittedRuc:boolean=false;
  submittedRuc2:boolean=false;
  submittedDNI:boolean=false;
  ipsvacias:boolean=true;
  ipvalida:boolean=false;
  ipExistente:boolean=false;

  public documento: ValidarDocumento = {
      nroDocumento: '',
    }
  constructor(private store: Store<AppCpState>,
    private route: Router, private activatedRoute: ActivatedRoute, private busquedaService: BusquedaService , private localStorageUsuarioService: LocalStorageUsuarioService ){
    this.store.dispatch(actions.seleccionarOpcionMenu({url:"/procesos/nueva-solicitud"}));
    //---
    this.solicitud = {
      idEntidad: 0,
      idOperacion: 0,
      usuarioRegistro: '',
      justificacion: '',
      nroDocumentoSolicitante: '',
      nombreSolicitante: '',
      idTiposSolicitud: 0,
      cuotaCambio: 50,
      estadoCambio: '',
      listaIps:[]
    };
    this.registroEntidad = {
      nroRuc: '',
      razonSocial: '',
      activo: '1'
    };
    this.listaEntidades = [];
    this.entidadSeleccionada = {
      idEntidad: 0,
      ruc: '',
      razonSocial: '',
      activo: ''
    };
    this.validacionRuc = {};
    this.itemSeleccionado = {};
    this.estadoSeleccionado = '1';
    this.hoy = new Date();
    const d1= new Date("January 01, 2021 00:00:00");
    const d2 = new Date(this.hoy.getTime() + (24 * 60 * 60 * 1000));     
    this.busqPermiso = {
      idEntidad: null,
      idOperacion: null,
      fechaDesde: d1,
      fechaHasta: d2,
      estado: null
    };
  }
  ngOnInit(): void {
    
    this.cargarUsuario();
    this.cargarTiposSolicitud();

    //CARGAR COMBO ESTADOS
    this.estados = [
      {label: 'Activo', value: '1'},
      {label: 'Inactivo', value: '0'}
    ];    

    this.listaOperaciones = [];
    this.listaOperacionesAux = [];
    this.cargarListaOperaciones();        

    this.listaIps = [];
    
    this.nroIpsPermitidas = environment.maxNroIpsPermitidas;
    this.cuotaMaxima = environment.maxNRoCuota;
  }

  cargarUsuario(){
    let usuario = this.localStorageUsuarioService.getUsuario();
    if(usuario != null) {
        //console.log(usuario);
        this.nomUsuario = usuario.usuario;
        this.perfilUsuario = usuario.idPerfil;
/*         if(this.perfilUsuario==1){
          this.esServiceDesk = true;
        } else{
          this.esServiceDesk = false;
        } */
    } 
  }

  cargarTiposSolicitud(){
    this.tiposSol = [];
    this.busquedaService.listarTiposSolicitud().subscribe({
      next:(data: ListarTipoSolicitudResponse)=>{
        if(data != null){
          if(data.codigo === constantes.RES_COD_EXITO) {
            if(data.data.length > 0){
                let lista = data.data;
                for(var i=0;i<lista.length;i++){
                  this.tiposSol.push({value: lista[i].idTipoSolicitud, label: lista[i].nombre});
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
    this.filtroma = 1;
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
    this.listaOperacionesAux = [];
    this.busquedaService.recuperarlistaOperacion().subscribe({
      next:(data:OperacionesComboResponse )=>{
        if(data != null){
          if(data.codigo === constantes.RES_COD_EXITO) {
                this.listaOperacionesAux = data.data;
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

  seleccionTipoSol(event: any){
    this.entidadSeleccionada = {
      idEntidad: 0,
      ruc: '',
      razonSocial: '',
      activo: ''
    };
    this.solicitud.idOperacion = 0;
    this.solicitud.cuotaCambio = 0;
    this.solicitud.estadoCambio = '';
    this.listaIps = [];
    this.documento.nroDocumento = '';
    this.solicitud.nombreSolicitante = '';
    this.solicitud.justificacion = '';
    this.permisoEncontrado=false;
    this.submitted=false;
    this.submittedDNI=false;
    this.submittedRuc=false;
    this.submittedRuc2=false;
  }

  agregarEntidad(){

    this.validacionRuc.ruc='';
    this.nombreEntidad="";
    this.registroEntidad = {
      nroRuc: '',
      razonSocial: '',
      activo: '1'
    };
    this.submittedRuc=false;
    this.submittedRuc2=false;
    this.dialogRegistroEntidad = true;

  }

  hideAgregarEntidad(){
    this.dialogRegistroEntidad = false;
  }

  saveEntidad(){
    this.validate = true;
    this.submittedRuc=true;

    if(this.validacionRuc.ruc ===null||this.validacionRuc.ruc===undefined|| this.validacionRuc.ruc===""){
      this.registroEntidad.nroRuc = '';
      this.validate = false;
    }else{
      this.registroEntidad.nroRuc = this.validacionRuc.ruc;
    }

    if(this.nombreEntidad ==null || this.nombreEntidad==undefined || this.nombreEntidad==""){
      this.registroEntidad.razonSocial = '';
      this.validate = false;
    }else{
      this.registroEntidad.razonSocial = this.nombreEntidad;
    }
    
    this.registroEntidad.activo = '1';   

    if(this.validate){
      Swal.fire({
        title: '¿Esta seguro de agregar esta entidad en el sistema?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Si',
        denyButtonText: `No`,
        confirmButtonColor: 'brown',
        denyButtonColor: 'brown'
      }).then((result) => {
        if (result.isConfirmed) {
          this.store.dispatch(actions.mostrarCargando({ estado: true}));
          try {
            this.busquedaService.registrarEntidad({ ...this.registroEntidad }).subscribe({
              next:(data:GenericResponse)=>{
                if(data != null){
                  if(data.codigo === constantes.RES_COD_EXITO) {
                      Swal.fire('Hecho!', 'Entidad Registrada Correctamente!' , 'info');              
                      this.dialogRegistroEntidad = false;
                      this.submittedRuc=false;
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
                Swal.fire('Atención!', err, 'warning');
                this.store.dispatch(actions.mostrarCargando({ estado: false}));
              }
            });       
          } catch (error) {
            this.store.dispatch(actions.mostrarCargando({ estado: false}));
            this.error = true;
          }

        } else if (result.isDenied) {
          Swal.fire('No se registro la entidad', '', 'info');
        }
      });      
    }   
  }

  limpiarNombreEntidad(){
    this.nombreEntidad='';
    this.registroEntidad.razonSocial='';
  }
  limpiarNombreSol(){
    this.solicitud.nombreSolicitante = '';
  }

  limpiarOperacion(){
    this.solicitud.idOperacion = 0;
    this.busqPermiso.idOperacion= 0;
    this.permisoEncontrado =false;
    this.listaOperaciones=[];
    //this.buscarData();
  }

  agregarIps(){
    this.direccionIp='';
    this.estadoIp = '';
    this.itemSeleccionado={};
    this.onEditarIp = false;
    this.onEditarIpNueva = false;
    this.dialogRegistroIps = true;
  }

  agregarIps2(){
    this.direccionIp='';
    this.estadoIp = '1';
    this.itemSeleccionado={};

    //console.log(this.listaIps);
    let existeNueva: boolean = false;
    let idtemp = this.createId();
    this.onEditarIp = false;
    /*this.onEditarIpNueva = false;
    this.dialogRegistroIps = true; */
    //validar que no exista fila con ippublica === ''
    for(let element of this.listaIps){
      if(element.ipPublica===''){
          existeNueva = true;
      }
    }
    if(!existeNueva){
        this.listaIps.push({idIpAcceso: 0 , idTemp: idtemp , ipPublica: this.direccionIp , activo: this.estadoIp, descActivo: 'Activo', flagCambio: 0}); 
    }else{
        Swal.fire('Ya existe una fila editable para agregar una nueva Ip', '', 'info') ;
    }
  }

  onRowEditInit(ip: IpModel, index: number) {
    //console.log(ip);
    this.indexRowSeleccionada = index;
    //console.log('Al iniciar la edicion de IP: ',ip);
    this.clonedIps[ip.idTemp] = {...ip};
//    console.log(this.clonedIps);
  }

  hideIps(){
    this.dialogRegistroIps = false;
  }

  onRowEditCancel(ip: IpModel) {
    this.listaIps[this.indexRowSeleccionada] = this.clonedIps[ip.idTemp];
    delete this.clonedIps[ip.idTemp];
    //console.log(this.listaIps);
  }

  //nuevo metodo 
  /* ya se agregó a listaIps las ips editadas y posiblemente una con ipPublica en blanco :: se elimina de clonedIps la ip a grabar */

  //anterior metodo 
  /* Verifica si se esta grabando por primera vez o es edición, sino es edición se verifica que no exista una ip Repetida */

  saveIps(ip : IpModel){
     //console.log('Al salvar IP CLONADA: ',this.clonedIps[ip.idTemp]);
     //console.log('Al salvar IP ORIGINAL:',ip);
     if(ip.idIpAcceso===0){
      //Para grabar o editar una IP nueva

      let noRepeat=true;
      noRepeat = this.validarIpUnica(ip.ipPublica);
      if(noRepeat){
        if(this.isValidIP(ip.ipPublica)){
            if(this.espacioPermitido()){
              delete this.clonedIps[ip.idTemp];
              this.listaIps[this.indexRowSeleccionada].flagCambio = 1;
            } else{
              this.onRowEditCancel(ip);
              Swal.fire('Actualmente se permite solo ingresar '+ environment.maxNroIpsPermitidas + ' Ips activas' , '', 'info') 
            }
        } else{
          this.onRowEditCancel(ip);
          Swal.fire('Dirección IPv4 invalida', '', 'info')  
        }
      } else{
        this.onRowEditCancel(ip);
        Swal.fire('No se puede registrar una dirección de Ip ya existente', '', 'info')
      }
    } else{
          //Para editar una IP ya registrada
          //validar si se esta modificando su estado ? cambiar el flag de 0 a 1 (pero si es 1 cambiarlo a 0) : cancelar
          //console.log('ip modificada', ip);
          //console.log('ip original', this.clonedIps[ip.idTemp] );

          if(ip.activo!==this.clonedIps[ip.idTemp].activo){
            //console.log('end IP CLONADA: ',this.clonedIps[ip.idTemp]);
            //console.log('end IP ORIGINAL:',ip);
            //console.log('index: ', this.indexRowSeleccionada);

            if(this.espacioPermitido()){
              this.listaIps[this.indexRowSeleccionada].flagCambio===0?this.listaIps[this.indexRowSeleccionada].flagCambio=1:this.listaIps[this.indexRowSeleccionada].flagCambio=0;
              this.listaIps[this.indexRowSeleccionada].activo==='1'?this.listaIps[this.indexRowSeleccionada].descActivo='Activo':this.listaIps[this.indexRowSeleccionada].descActivo='Inactivo';
              delete this.clonedIps[ip.idTemp];
            } else{
              Swal.fire('El número máximo de IPs activas es '+ environment.maxNroIpsPermitidas, '', 'info')  
              this.onRowEditCancel(ip);
            }
          } else{
            this.onRowEditCancel(ip);
          }
         /*  if(this.itemSeleccionado.activo!==this.estadoIp){
            this.listaIps[this.findIndexById(this.itemSeleccionado.ipPublica)].ipPublica = this.direccionIp;
            this.listaIps[this.findIndexById(this.itemSeleccionado.ipPublica)].activo = this.estadoIp;
            this.estadoIp=='1'?this.listaIps[this.findIndexById(this.itemSeleccionado.ipPublica)].descActivo='Activo':this.listaIps[this.findIndexById(this.itemSeleccionado.ipPublica)].descActivo='Inactivo';
            //cambiar flagCambio en caso se este modificando y sea una ip registrada previamente
            //VALIDA QUE NO SEA UNA IP NUEVA
            if(this.listaIps[this.findIndexById(this.itemSeleccionado.ipPublica)].idIpAcceso !== 0 ){
              if(this.listaIps[this.findIndexById(this.itemSeleccionado.ipPublica)].flagCambio===0){
                this.listaIps[this.findIndexById(this.itemSeleccionado.ipPublica)].flagCambio=1;
              }else{
                this.listaIps[this.findIndexById(this.itemSeleccionado.ipPublica)].flagCambio=0;
              }
            }
          }
          this.listaIps = [...this.listaIps];
          this.dialogRegistroIps = false; */
    } 
  }
  
  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < 5; i++ ) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.listaIps.length; i++) {
        if (this.listaIps[i].ipPublica === id) {
            index = i;
            break;
        }
    }
      return index;
  }

  validaIpDirect(event:any){
    //console.log(this.direccionIp);
    this.ipvalida=false;
    this.ipvalida = this.isValidIP(this.direccionIp);
  }

  validarIpUnica(ip: string): boolean{
    let flag=true;
    let cont=0;
    for (let i = 0; i < this.listaIps.length; i++) {
      if (this.listaIps[i].ipPublica === ip) {
          cont++;
          if(cont===2){
            flag = false;
            break;
          }
      }
    }
    return flag;
  }

  onRowEdit(item: any){
    //console.log(item);
    this.direccionIp=item.ipPublica;
    //console.log(this.direccionIp);
    this.estadoIp = item.activo;
    this.onEditarIp = true;
    item.idIpAcceso===0?this.onEditarIpNueva = true:this.onEditarIpNueva = false;
    this.dialogRegistroIps = true;
    this.itemSeleccionado = item;
  }

  onRowDelete(item: any){
      let nuevaIp=true;
      item.idIpAcceso==0?nuevaIp=true:nuevaIp=false;
      if(nuevaIp){
        this.listaIps = this.listaIps.filter(val => val.idTemp !== item.idTemp);
        item = {};
      } else{
        Swal.fire('Solo es posible eliminar las Ips que se estan agregando en la solicitud, no las que ya han sido registradas previamente', '', 'info')
      }
  }

  validarRuc(){
    this.submittedRuc2=true;
    if(this.validacionRuc.ruc !==null && this.validacionRuc.ruc!==undefined && this.validacionRuc.ruc!==""){
    this.busquedaService.validarRuc(this.validacionRuc).subscribe({
      next:(data:ConsultaRucResponse )=>{
        //console.log(data);
        if(data.data.nroRuc!==null && data.data.nroRuc!==undefined && data.data.nroRuc!==""){
          this.nombreEntidad= data.data.razonSocial;
          this.submittedRuc2=false;
        } else {
          this.nombreEntidad='';
          Swal.fire('Info!', data.data.respuestaSunat , 'info');
          this.submittedRuc2=false;
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

  validarDocumento(event:any){
    this.submittedDNI=true;
    if(this.documento.nroDocumento !==null && this.documento.nroDocumento!==undefined && this.documento.nroDocumento!==""){
      this.busquedaService.validarDocumentoIdentidad(this.documento).subscribe({
        next:(data:ValidarDocIdentidadResponse )=>{
          //console.log(data);
          if(data.data.nroDocumento!==null && data.data.nroDocumento!==undefined && data.data.nroDocumento!==""){
            this.submittedDNI=false;
            this.solicitud.nombreSolicitante = data.data.apellidoPaterno + " " + data.data.apellidoMaterno + " " + data.data.nombres;
            this.solicitud.nroDocumentoSolicitante = this.documento.nroDocumento;
          }else {
            this.submittedDNI=false;
            this.solicitud.nombreSolicitante = '';
            this.solicitud.nroDocumentoSolicitante='';
            Swal.fire(data.data.respuestaReniec , '', 'info');
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

  buscarIPsEntidad(){
    if(this.filtroma===1){
      //actualizar combo operacion con todas las disponibles menos la que ya registra la entidad
      this.completarComboOperacion2();
      this.listarIps(this.entidadSeleccionada.idEntidad);
    } else{
      //actualizar combo operacion con las disponibles segun la entidad
      this.completarComboOperacion1();
      if(this.filtroma===3){
        this.buscarData();
      }
    }
  }
  entidadChange(event:any){
    console.log("changbe");
  }

  completarComboOperacion1(){
    this.validate = true;
    this.listaOperaciones=[];
    if(this.entidadSeleccionada.razonSocial ===null|| this.entidadSeleccionada.razonSocial ===undefined|| this.entidadSeleccionada.razonSocial ===""){
      this.busqPermiso.idEntidad = 0;
      this.validate = false;
    }else{
      this.busqPermiso.idEntidad = this.entidadSeleccionada.idEntidad;
    }
    if(this.validate){
      this.busquedaService.buscarPermisos(this.busqPermiso).subscribe({
        next:(data: BuscarPermisosResponse)=>{
          if(data != null){
            if(data.codigo === constantes.RES_COD_EXITO) {
              if(data.data.list.length > 0){               
                  let lista = data.data.list;
                  //console.log(lista);
                  for(let element of lista){
                    this.listaOperaciones.push({idOperacion: element.idOperacion, nombre: element.operacion,descripcion:element.operacion,endPoint:element.endpoint,cuotaDefecto:element.cuotaDefecto.toString(),activo:element.activoOpercion});
                  }
              }else{
                Swal.fire('Info!', 'No se encontraron operaciones disponibles!' , 'info');
                this.permisoEncontrado=false;
              }
            } else {
              Swal.fire('Info!', data.descripcion , 'info');
              this.permisoEncontrado=false;
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

  completarComboOperacion2(){
    this.validate = true;
    this.listaOperaciones=[];
    if(this.entidadSeleccionada.razonSocial ===null|| this.entidadSeleccionada.razonSocial ===undefined|| this.entidadSeleccionada.razonSocial ===""){
      this.busqPermiso.idEntidad = 0;
      this.validate = false;
    }else{
      this.busqPermiso.idEntidad = this.entidadSeleccionada.idEntidad;
    }
    if(this.validate){
      this.busquedaService.buscarPermisos(this.busqPermiso).subscribe({
        next:(data: BuscarPermisosResponse)=>{
          if(data != null){
            if(data.codigo === constantes.RES_COD_EXITO) {
              if(data.data.list.length > 0){               
                  let lista = data.data.list;
                  let aux :any =[];
                  //console.log('lista segun la entida: ',lista);
                  //console.log('lista de total de operaciones',this.listaOperacionesAux)
                  for(let operacion of this.listaOperacionesAux){
                    let valida = true;
                    for(let element of lista){
                        if(operacion.idOperacion===element.idOperacion){
                          valida=false; }
                    }
                    if(valida){
                      aux.push(operacion);
                    }
                  }
                  this.listaOperaciones = aux
                  //console.log('lista resultante: ',aux);
              }else{
                this.listaOperaciones =this.listaOperacionesAux;
              }
            } else {
              Swal.fire('Info!', data.descripcion , 'info');
              this.permisoEncontrado=false;
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

  isValidIP(str:any): boolean {
    let verdad = str.split('.');
    if(verdad.length != 4)
      return false;
    for(let i in verdad){
      if(!/^\d+$/g.test(verdad[i])
      ||+verdad[i]>255
      ||+verdad[i]<0
      ||/^[0][0-9]{1,2}/.test(verdad[i]))
        return false;
    }
    return true
  }

  espacioPermitido(): boolean{
    let cont=0;
    for(let element of this.listaIps){
      if(element.activo==="1")
      cont++;
    }
    if(cont>environment.maxNroIpsPermitidas){
      return false
    } else {
      return true
    }
  }

  listarIps(nroEntidad: number){
    this.listaIps = [];
    if(nroEntidad !==null && nroEntidad!==undefined){
      this.busquedaService.listarIpsPorEntidad(nroEntidad).subscribe({
        next:(data:ListarIpsEntidadResponse )=>{
          if(data != null){
            if(data.codigo === constantes.RES_COD_EXITO) {
                  this.listaIps = data.data;
                  //console.log('lista original : ', this.listaIps);
                  for(let i=0;i<this.listaIps.length;i++){
                    this.listaIps[i].activo==='Activo'?this.listaIps[i].activo='1':this.listaIps[i].activo='0';
                    this.listaIps[i].activo==='1'?this.listaIps[i].descActivo='Activo':this.listaIps[i].descActivo='Inactivo';
                    this.listaIps[i].idTemp = this.createId();
                    this.listaIps[i].flagCambio=0;
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

  buscarData(){

    if(this.filtroma!==1){
      this.error = false;
      this.validate = true;
      this.permisoEncontrado = false;

      if(this.entidadSeleccionada.razonSocial ===null|| this.entidadSeleccionada.razonSocial ===undefined|| this.entidadSeleccionada.razonSocial ===""){
        this.busqPermiso.idEntidad = 0;
        this.validate = false;
      }else{
        this.busqPermiso.idEntidad = this.entidadSeleccionada.idEntidad;
      }

      if(this.filtroma!==3){
        if(this.solicitud.idOperacion ==null || this.solicitud.idOperacion==undefined){
          this.busqPermiso.idOperacion = 0;
          this.validate = false;
        } else {
          this.busqPermiso.idOperacion = this.solicitud.idOperacion;
        }
      }else{
        this.busqPermiso.idOperacion = 0;
      }  
      
      //console.log(this.busqPermiso);
      if(this.validate){
        this.busquedaService.buscarPermisos(this.busqPermiso).subscribe({
          next:(data: BuscarPermisosResponse)=>{
            if(data != null){
              if(data.codigo === constantes.RES_COD_EXITO) {
                if(data.data.list.length > 0){               
                    //cargar cuota y estado
                    this.solicitud.cuotaCambio = data.data.list[0].cuotaAsignada;
                    data.data.list[0].activo==='Activo'?this.solicitud.estadoCambio='1':this.solicitud.estadoCambio='0'
                    //cargar lista IP's
                    this.listarIps(this.busqPermiso.idEntidad? this.busqPermiso.idEntidad:0);
                    this.permisoEncontrado=true;
                }else{
                  Swal.fire('Info!', 'No se encontraron resultados!' , 'info');
                  this.permisoEncontrado=false;
                }
              } else {
                Swal.fire('Info!', data.descripcion , 'info');
                this.permisoEncontrado=false;
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
  }

  registroSolicitud(event:any){
    this.error = false;
    this.submitted=true;
    this.validate = true;
    this.ipsvacias = false;
    if(this.entidadSeleccionada!==null && this.entidadSeleccionada!==undefined){
      if(this.entidadSeleccionada.razonSocial ===null||this.entidadSeleccionada.razonSocial ===undefined|| this.entidadSeleccionada.razonSocial ===""){
        this.solicitud.idEntidad = 0;
        this.validate = false;
      }else{
        this.solicitud.idEntidad = this.entidadSeleccionada.idEntidad;
      }
    } else{
      this.solicitud.idEntidad = 0;
      this.validate = false;
    }

    if(this.filtroma!==3){
      if(this.solicitud.idOperacion ==null || this.solicitud.idOperacion==undefined){
        this.solicitud.idOperacion = 0;
        this.validate = false;
      }
    } else {
      this.solicitud.idOperacion = 0;
    }

    if(this.filtroma===2){
      if(this.solicitud.cuotaCambio ===null||this.solicitud.cuotaCambio ===undefined|| this.solicitud.cuotaCambio ===0){
        this.solicitud.cuotaCambio=0;
        this.validate = false;
      }
    }
    if(this.filtroma===4){
      if(this.solicitud.estadoCambio ==null || this.solicitud.estadoCambio==undefined){
        this.solicitud.estadoCambio = '';
        this.validate = false;
      }
    }  

    if(this.documento!==null && this.documento!==undefined){
      if(this.documento.nroDocumento ===null||this.documento.nroDocumento ===undefined|| this.documento.nroDocumento ===""){
        this.documento.nroDocumento= '';
        this.validate = false;
      }
    }else{
      this.validate = false;
    }

    if(this.solicitud.nombreSolicitante ===null||this.solicitud.nombreSolicitante ===undefined|| this.solicitud.nombreSolicitante ===""){
      this.solicitud.nombreSolicitante='';
      this.validate = false;
    }
    
    if(this.solicitud.justificacion ===null||this.solicitud.justificacion ===undefined|| this.solicitud.justificacion ===""){
      this.solicitud.justificacion='';
      this.validate = false;
    }    

    if(this.filtroma ===null|| this.filtroma ===undefined){
      this.solicitud.idTiposSolicitud = 0;
      this.validate = false;
    }else{
      this.solicitud.idTiposSolicitud = this.filtroma;
      this.filtroma==1?this.solicitud.estadoCambio='1':this.solicitud.estadoCambio=this.solicitud.estadoCambio;
    }

    //Validar que la lista de ips no este vacia
    this.solicitud.listaIps = this.listaIps.filter(val => val.flagCambio === 1);
    if(this.filtroma==1){
      if(this.listaIps.length===0){
        this.validate = false;
        this.ipsvacias = true;
      }
    }else if(this.filtroma==3){
      if(this.solicitud.listaIps.length===0){
        this.validate = false;
        this.ipsvacias = true;
      }
    }

    this.solicitud.usuarioRegistro = this.nomUsuario;

    //console.log(this.solicitud);

    if(this.validate){
      Swal.fire({
        title: '¿Esta seguro de registrar esta solicitud?',
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
            this.busquedaService.registrarSolicitudPermiso(this.solicitud).subscribe({
              next:(data: GenericResponse)=>{
                if(data != null){
                  if(data.codigo === constantes.RES_COD_EXITO) {
                    //console.log(data);
                    this.submitted=false;
                    this.ipsvacias = false;
                    let nroSolicitud = data.data.idSolicitud;
                    Swal.fire( 'Solicitud N°' + nroSolicitud + ' registrada correctamente', '', 'info'); 
                    this.store.dispatch(actions.mostrarCargando({ estado: false}));
                    this.route.navigate(['/procesos/solicitudes'], {relativeTo: this.activatedRoute}); 
                  } else {
                    this.ipsvacias = false;
                    this.submitted=false;
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
          Swal.fire('No se realizó el registro de la solicitud', '', 'info')
        }
      });               
    } else if(this.ipsvacias){
      Swal.fire('No se puede registrar la solicitud sin agregar o modificar direcciones Ip', '', 'info')
    }  

  }

}
