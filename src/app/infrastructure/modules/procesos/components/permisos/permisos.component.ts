import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import * as actions from '../../../../global-store/cp.actions';
import { AppCpState } from '../../../../global-store/cp.reducers';
import { BusquedaService } from 'src/app/infrastructure/services/remote/busqueda.service';
import { LocalStorageUsuarioService } from 'src/app/infrastructure/services/local/local-storage-usuario.service';

import {SelectItem} from 'primeng/api';
import { Entidad, OperacionCombo, IpModel2 } from 'src/app/domain/dto/ProcesosRequest.dto';
import { FiltroBusquedaPermisos } from 'src/app/domain/dto/ProcesosRequest.dto';
import Swal from 'sweetalert2';
import { constantes, mensajes } from 'src/app/constants';
import { BuscarPermisosResponse, ConsumoData, EntidadesSugerenciasResponse, ListarIpsResponse, OperacionesComboResponse, cuotaConsumoResponse } from 'src/app/domain/dto/ProcesosResponse.dto';
interface Opcion {
  name: string,
  code: string
}

@Component({
  selector: 'app-permisos',
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.scss']
})
export class PermisosComponent implements OnInit {
  filtro: any = {};
  hoy:Date = new Date();
  //--
  permisos: any[] = [];
  permisoSeleccionado: any = {};
  rq: any = {};
  rqSelecionado: any = {};
  
  //opciones: Opcion[];
  
  listaIps: IpModel2[]=[];
  listaConsumo: ConsumoData | null;
  basicData: any;
  basicOptions: any;
  rangoAnios: SelectItem[] = [];
  anioSeleccionado: number = 0;
  meses: SelectItem[] = [];
  mesSeleccionado: number = 0;

  nomUsuario: string = '';
  perfilUsuario: number = 0;

  error:boolean=false;
  portada:boolean=false;
  esServiceDesk: boolean=true;
  validate:boolean=true;
  dialogConsumo:boolean=false;
  dialogIps:boolean=false;
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
  constructor(private store: Store<AppCpState>, private busquedaService: BusquedaService, private localStorageUsuarioService: LocalStorageUsuarioService){
    this.store.dispatch(actions.seleccionarOpcionMenu({url:"/procesos/permisos"}));
    //---
    this.permisos=[]
    this.permisoSeleccionado = null;
    this.listaIps=[];
    this.listaConsumo = null;
    this.basicData = {};
    this.basicOptions = {};
    this.permisos=[];
    this.portada=true;
    //---
    this.hoy = new Date();
    const d1= new Date(new Date().getFullYear(), 0, 1);
    const d2 = new Date(this.hoy.getTime() + (24 * 60 * 60 * 1000));
    this.filtro = {
      idEntidad: null,
      idOperacion: null,
      fechaDesde: d1,
      fechaHasta: d2,
      estado: null
    };
    //---
    this.listaEntidades=[];
    this.entidadSeleccionada = null;
  }

  ngOnInit(): void {
    this.permisos=[]
    this.permisoSeleccionado = null;

    this.portada=true;
    this.permisos=[];

    /**this.store.select('cargarLista').subscribe(({ lista }) => {
      if(lista) {
          this.permisos = lista;
          this.permisos.length>0?this.portada=false:this.portada=true;
      } else {
         this.permisos=[];
      }
    });*/

    this.cargarUsuario();
    this.cargarRangoAnios();
    this.cargarMeses();
    this.applyLightTheme();
   
    this.buscarPermisos(this.filtro);
    //--
    this.cargarListaOperaciones();   
    
    //CARGAR COMBO ESTADOS
    this.estados = [
      {label: 'Activo', value: '1'},
      {label: 'Inactivo', value: '0'}
    ];
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
fechaDesdeSeleccionado(event:any){
  //  this.fechaHastaMax = this.maxFecha(event);
  //    this.fechaHasta = this.fechaHastaMax;
    this.fechaDesde = event;
  }


consultarPermisos():void{

if(this.entidadSeleccionada==null||this.entidadSeleccionada==undefined||this.entidadSeleccionada.razonSocial==""){
  this.filtro.idEntidad = null;
} else {
  this.filtro.idEntidad = this.entidadSeleccionada.idEntidad;
}        
this.buscarPermisos(this.filtro);
}


  buscarPermisos(filtro:FiltroBusquedaPermisos) {
    this.error = false;
    this.portada = true;

    //const d: Date = new Date();
    //const dh = new Date("July 21, 2021 00:00:00");
    //console.log("filtro original",filtro);
    //filtro =  {idEntidad:null, idOperacion:null , fechaDesde: dh  , fechaHasta: d , estado: '1'}  ;
    this.store.dispatch(actions.mostrarCargando({ estado: true}));
    try {
      this.busquedaService.buscarPermisos({ ...filtro }).subscribe({
        next:(data: BuscarPermisosResponse)=>{
          if(data != null){
            if(data.codigo === constantes.RES_COD_EXITO) {
              this.portada = false;
              //this.requisitorias = data.data;
              // data ok
              /* if(this.requisitorias && this.requisitorias.length > 0) {
                this.rq = this.requisitorias[0];
                this.rqSelecionado = {...this.rq};
              } */
              //console.log(data.descripcion);
              //console.log(data.data.pageSize);
              //console.log(data.data.list);
              this.permisos = data.data.list;
              this.store.dispatch(actions.mostrarCargando({ estado: false}));
              if(data.data.list.length==0){
                Swal.fire('Atención!', mensajes.MSG_RESP_NOT_DATA_LIST, 'info');
              }

            } 
            else {
              this.store.dispatch(actions.mostrarCargando({ estado: false}));
              Swal.fire('Atención!', data.descripcion+ '\n Código de Operación:'+ data.codigoOperacion, 'info');
            }
          } else {
            this.store.dispatch(actions.mostrarCargando({ estado: false}));
            Swal.fire('Atención!', mensajes.MSG_RESP_NOT_DATA, 'info');
            //this.requisitorias = [];
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


  cargarRangoAnios(){
    this.rangoAnios = [];
    var currentYear = (new Date()).getFullYear();
    var initYear = currentYear - 20;
    for(let i = currentYear ; i >= initYear ; i--){
      this.rangoAnios.push({label: i.toString() , value: i});
    }
  }

  cargarMeses(){
    this.meses = [];
    let mesesDescripciones = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Setiembre','Octubre','Noviembre','Diciembre'];
    for(let i = 0 ; i < 12 ; i++){
      this.meses.push({label: mesesDescripciones[i] , value: i+1});
    }
  }

  applyLightTheme() {
    this.basicOptions = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
  }


  cargarUsuario(){
    this.esServiceDesk = this.localStorageUsuarioService.esServiceDesk();
    let usuario = this.localStorageUsuarioService.getUsuario();
    if(usuario != null) {
        this.nomUsuario = usuario.usuario;
        this.perfilUsuario = usuario.idPerfil;
    }
  }

  verIps(item: any){

    this.listaIps = [];
    this.dialogIps = true;

    var nroEntidad = 0;
    if(item.idEntidad ==null||item.idEntidad==undefined|| item.idEntidad==""){
      nroEntidad = 0;
    }else{
      nroEntidad = item.idEntidad;
    }    
    this.listaIps = [];
    this.busquedaService.listarIpsPorEntidad(nroEntidad).subscribe({
      next:(data: ListarIpsResponse)=>{
        if(data != null){
          if(data.codigo  === constantes.RES_COD_EXITO) {
                this.listaIps = data.data;
                //console.log(this.listaIps);
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

  hideIps(){
    this.dialogIps = false;
  }



  openConsumo(){
      this.dialogConsumo = true;
      this.anioSeleccionado = (new Date()).getFullYear();
      this.mesSeleccionado = (new Date()).getMonth()+1;
      this.verConsumo();
  }

  hideConsumo(){
    this.dialogConsumo = false;
    
  }

  diasEnUnMes(mes:any, año:any) {
    return new Date(año, mes, 0).getDate();
  }

  verConsumo(){

    var nroEntidad = 0;
    var nroSolicitud = 0;
    let anio = 0;
    let mes = 0;
    this.validate=true;
    this.listaConsumo = null;
    let listaMeses: any={};
    let listaConsumoSuma: any={};
    let listaCuotaAsignada: any={};
    let listaCuotaMensual: any=[];

    if(this.anioSeleccionado ==null||this.anioSeleccionado==undefined|| this.anioSeleccionado==0){
      anio = 0;
      this.validate=false;
    }else{
      anio = this.anioSeleccionado;
    } 

    if(this.mesSeleccionado ==null||this.mesSeleccionado==undefined|| this.mesSeleccionado==0){
      mes = 0;
      this.validate=false;
    }else{
      mes = this.mesSeleccionado;
    } 

    if(this.permisoSeleccionado.idEntidad ==null||this.permisoSeleccionado.idEntidad==undefined|| this.permisoSeleccionado.idEntidad==""){
      nroEntidad = 0;
      this.validate=false;
    }else{
      nroEntidad = this.permisoSeleccionado.idEntidad;
    }

    if(this.permisoSeleccionado.idOperacion ==null||this.permisoSeleccionado.idOperacion==undefined|| this.permisoSeleccionado.idOperacion==""){
      nroSolicitud = 0;
      this.validate=false;
    }else{
      nroSolicitud = this.permisoSeleccionado.idOperacion;
    }

    //console.log('parametro ver consumo', nroEntidad,nroSolicitud,anio,mes) ;
    if(this.validate){
      this.busquedaService.verConsumoCuota(nroEntidad,nroSolicitud,anio,mes).subscribe({
        next:(data: cuotaConsumoResponse)=>{
          if(data != null){
            if(data.codigo  === constantes.RES_COD_EXITO) {
                  this.listaConsumo = data.data;
                  //console.log('lista response',this.listaConsumo);
                  listaMeses = data.data.consumoDia;
                  //console.log(listaMeses);                
                  listaConsumoSuma = data.data.consumoCuota;
                  //console.log(listaConsumoSuma);   
                  listaCuotaMensual = data.data.cuotaAsignada;
                  //console.log(listaCuotaAsignada);

              /*    for(var i=0;i<listaCuotaAsignada.length;i++){
                      listaCuotaMensual.push(listaCuotaAsignada[i] * this.diasEnUnMes(i+1,anio));
                      //console.log(i,' : ',  this.diasEnUnMes(i+1,anio)   );
                      //listaCuotaAsignada[i]
                  } */
                  //console.log('cuota x mes:', listaCuotaMensual);

                  this.basicData = {
                    labels: listaMeses,
                    datasets: [
                        {
                            label: 'Cuota Asignada',
                            data: listaCuotaMensual,
                            fill: false,
                            borderColor: '#42A5F5',
                            tension: .4
                        },
                        {
                            label: 'Consumo del día',
                            data: listaConsumoSuma,
                            fill: false,
                            borderColor: '#FFA726',
                            tension: .4
                        }
                    ]
                  };                


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
