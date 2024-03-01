import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as actions from '../../../../global-store/cp.actions';
import { AppCpState } from '../../../../global-store/cp.reducers';
import { MantenimientosService} from '../../../../services/remote/mantenimientos.service';
import Swal from 'sweetalert2';
import { constantes } from 'src/app/constants';
import { OperacionModel } from 'src/app/domain/models/Operacion.model';
import { OperacionesListarResponse } from 'src/app/domain/dto/OperacionResponse.dto';
import { GenericResponse } from 'src/app/domain/dto/BaseResponse,dto';

@Component({
  selector: 'app-operaciones',
  templateUrl: './operaciones.component.html',
  styleUrls: ['./operaciones.component.scss']
})
export class OperacionesComponent{
  operacionDialog: boolean= false;
  listaOperaciones: OperacionModel[] = [];

  operacion: OperacionModel ={
    idOperacion:null,
    nombre:'',
    operacion:'',
    descripcion:'',
    endPoint:'',
    cuotaDefecto:50,
    requiereAprobacionAcceso:'0',
    requiereAprobacionCuota:'0',
    requiereAprobacionIps:'0',
    requiereAprobacionEstado:'0',
    activo:'1'
  }
  requiereAprobacionAcceso = false;
  requiereAprobacionCuota = false;
  requiereAprobacionIps = false;
  requiereAprobacionEstado = false;
  estadosOperacion: any[]=[];

  modificar:boolean = false;
  
  constructor(private store: Store<AppCpState>,
      private mantenimientosService: MantenimientosService) { 
        this.estadosOperacion =  [
          {value:'1', label:'Activo'},
          {value:'0', label:'Inactivo'}
          
        ];
        this.store.dispatch(actions.seleccionarOpcionMenu({url:"/mantenimientos/operaciones"}));
        this.listarOperaciones();
  }

  listarOperaciones():void{
    this.mantenimientosService.getOperaciones().subscribe({
      next:(response:OperacionesListarResponse)=>{
        if(response.codigo===constantes.RES_COD_EXITO){
          if(response.data){
            this.listaOperaciones = response.data;
          }
          else{
            Swal.fire('Atención!', 'Respuesta del servicio no valido', 'info');
          }
        }
        else{
          Swal.fire('Atención!', response.descripcion+ '\n Código de Operación:'+ response.codigoOperacion, 'info');
        }
      },
      complete:()=>{
      },
      error:(err)=>{
        Swal.fire('Atención!', err, 'warning');
      }
    });
  }

  nuevoOperacion() {
    this.modificar = false;
    this.operacion ={
      idOperacion:null,
      nombre:'',
      operacion:'',
      descripcion:'',
      endPoint:'',
      cuotaDefecto:50,
      requiereAprobacionAcceso:'0',
      requiereAprobacionCuota:'0',
      requiereAprobacionIps:'0',
      requiereAprobacionEstado:'0',
      activo:'1'
    }
    this.requiereAprobacionAcceso = false;
    this.requiereAprobacionCuota = false;
    this.requiereAprobacionIps = false;
    this.requiereAprobacionEstado = false;
    this.operacionDialog = true;
  }
  
  verEditarOperacion(operac: OperacionModel) {
    this.operacion = {...operac};
    this.requiereAprobacionAcceso = this.operacion.requiereAprobacionAcceso === '1';
    this.requiereAprobacionCuota = this.operacion.requiereAprobacionCuota === '1';
    this.requiereAprobacionIps = this.operacion.requiereAprobacionIps === '1';;
    this.requiereAprobacionEstado = this.operacion.requiereAprobacionEstado === '1';;
    this.operacionDialog = true;
    this.modificar = true;
  }


  guardarCambiosEventClick():void{
    this.operacion.nombre = this.operacion.nombre?.trim();
    this.operacion.operacion = this.operacion.operacion?.trim();
    this.operacion.descripcion = this.operacion.descripcion?.trim();
    this.operacion.endPoint = this.operacion.endPoint?.trim();
    this.operacion.cuotaDefecto = this.operacion.cuotaDefecto===null?0:this.operacion.cuotaDefecto

    this.operacion.requiereAprobacionAcceso = this.requiereAprobacionAcceso?'1':'0';
    this.operacion.requiereAprobacionCuota = this.requiereAprobacionCuota?'1':'0';
    this.operacion.requiereAprobacionIps = this.requiereAprobacionIps?'1':'0';
    this.operacion.requiereAprobacionEstado = this.requiereAprobacionEstado?'1':'0';

    if(!this.operacion.nombre || this.operacion.nombre=="" || this.operacion.nombre.length>50){
      Swal.fire('Atención!', 'El campo “Nombre” es requerido, máximo 50 caracteres de longitud', 'warning');
      return;
    }

    if(!this.operacion.operacion || this.operacion.operacion=="" || this.operacion.operacion.length>50){
      Swal.fire('Atención!', 'El campo “Operacion” es requerido, máximo 50 caracteres de longitud', 'warning');
      return;
    }

    if(!this.operacion.descripcion || this.operacion.descripcion=="" || this.operacion.descripcion.length>60){
      Swal.fire('Atención!', 'El campo “Descripción” es requerido, máximo 60 caracteres de longitud', 'warning');
      return;
    }
    
    if(!this.operacion.endPoint || this.operacion.endPoint=="" || this.operacion.endPoint.length>120){
      Swal.fire('Atención!', 'El campo "Endpoint" es requerido, máximo 120 caracteres de longitud', 'warning');
      return;
    }

    if(!this.operacion.cuotaDefecto || this.operacion.cuotaDefecto < 20){
      Swal.fire('Atención!', 'El campo "Cuota por Defecto" es requerido, minimo valor 20', 'warning');
      return;
    }

    if(this.operacion.idOperacion === 0 || this.operacion.idOperacion==null){
      this.crearOperacion();
    }
    else{
      this.actualizarOperacion();
    }
  }
  crearOperacion():void{
    this.store.dispatch(actions.mostrarCargando({ estado: true}));

    this.mantenimientosService.postCrearOperacion({...this.operacion}).subscribe({
      next:(data:GenericResponse )=>{
        this.store.dispatch(actions.mostrarCargando({ estado: false}));
        if(data.codigo === constantes.RES_COD_EXITO){
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            html:
            data.descripcion+'<br/>' +
            'Operación:' + this.operacion.nombre,
          });
          this.operacionDialog = false;
        }
        else{
          Swal.fire('Atención!', data.descripcion+ '\n Código de Operación:'+ data.codigoOperacion, 'info');
        }
      },
      complete:()=>{
        this.listarOperaciones();
      },
      error:(err)=>{
        this.store.dispatch(actions.mostrarCargando({ estado: false}));
        Swal.fire('Atención!', err, 'warning');
      }
    });
    
  }

  actualizarOperacion():void{
    this.store.dispatch(actions.mostrarCargando({ estado: true}));

    this.mantenimientosService.postActualizarOperacionb({...this.operacion}).subscribe({
      next:(data: GenericResponse)=>{
        if(data.codigo===constantes.RES_COD_EXITO){
          //Swal.fire('Éxito', data.descripcion, 'success');
          this.store.dispatch(actions.mostrarCargando({ estado: false}));
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            html:
            data.descripcion+'<br/>' +
            'Operación:' + this.operacion.nombre,
          });
          this.operacionDialog = false;
          
        }
        else{
          
          this.store.dispatch(actions.mostrarCargando({ estado: false}));
          Swal.fire('Atención!', data.descripcion+ '\n Código de Operación:'+ data.codigoOperacion, 'info');
        }
      },
      complete:()=>{
        this.listarOperaciones();
      },
      error:(err)=>{
        this.store.dispatch(actions.mostrarCargando({ estado: false}));
        Swal.fire('Atención!', err, 'warning');
      }
    });
  }
}
