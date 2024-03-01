import { HttpClient } from "@angular/common/http";
import { Injectable, EventEmitter } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { EvaluarSolicitud, FiltroBusquedaPermisos, FiltroBusquedaSolicitud, OperacionCombo, RegistroSolicitud, RegistroEntidad, ValidarDocumento } from "../../../domain/dto/ProcesosRequest.dto";
import { handleError } from "./BaseService";


@Injectable({
    providedIn: 'root'
})
export class BusquedaService {

    constructor(private httpClient: HttpClient){}

    buscarPermisos(filtro: FiltroBusquedaPermisos) {
        return this.httpClient.post(`${ environment.urlApi }buscarPermisos`, filtro).pipe(
            map((result: any) => result),
            catchError(handleError)
        );
    }
    
    buscarSolicitudes(filtro: FiltroBusquedaSolicitud) {
        return this.httpClient.post(`${ environment.urlApi }buscarSolicitudes`, filtro).pipe(
            map((result: any) => result),
            catchError(handleError)
        );
    }

    evaluarSolicitud(evaluacion: EvaluarSolicitud) {
        return this.httpClient.post(`${ environment.urlApi }evaluarSolicitudCuota`, evaluacion).pipe(
            map((result: any) => result),
            catchError(handleError)
        );
    }    

/*     recuperarDetalle(anio: string, distrito: number, idCorrelativo: number) {
        return this.httpClient.get(`${ environment.urlApi }detalleBusquedaRequisitoria?anio=${anio}&codDistrito=${distrito}&idCorrelativo=${idCorrelativo}`).pipe(
            map((result: any) => result),
            catchError(err => {
                Swal.fire('Atención!', 'Busca requerimientos', 'warning');
                return throwError(err);
            })
        );
    } */

/*     recuperarHistorial(anio: string, distrito: number, idCorrelativo: number, proc: number) {
        return this.httpClient.get(`${ environment.urlApi }historialProceso?anio=${anio}&codDistrito=${distrito}&idCorrelativo=${idCorrelativo}&idProces=${proc}`).pipe(
            map((result: any) => result),
            catchError(err => {
                Swal.fire('Atención!', 'Busca requerimientos', 'warning');
                return throwError(err);
            })
        );
    } */

    recuperarlistaEntidades(){
        return this.httpClient.get(`${ environment.urlApi }listarComboEntidad`).pipe(
            map((result: any) => result),
            catchError(err => {
                Swal.fire('Atención!', 'Error recuperar entidades', 'warning');
                return throwError(err);
            })
        );
    }

    recuperarlistaOperacion(){
        return this.httpClient.get(`${ environment.urlApi }listarComboOperacion`).pipe(
            map((result: any) => result),
            catchError(handleError)
        );
    }

    recuperarEntidadesSugeridas(cadena :string){
        return this.httpClient.get(`${ environment.urlApi }completarComboEntidad?razonSocial=${cadena}`).pipe(
            map((result: any) => result),
            catchError(handleError)
        );        
    }

    registrarEntidad(entidad: RegistroEntidad){
        return this.httpClient.post(`${ environment.urlApi }registrarEntidad`,entidad).pipe(
            map((result: any) => result),
            catchError(handleError)
        );
    }

    validarDocumentoIdentidad(doc: ValidarDocumento){
        return this.httpClient.post(`${ environment.urlApi }validarDocumentoIdentidad`,doc).pipe(
            map((result: any) => result),
            catchError(handleError)
        );
    }
    
    validarRuc(ruc: any){
        return this.httpClient.post(`${ environment.urlApi }validarRuc`,ruc).pipe(
            map((result: any) => result),
            catchError(handleError)
        );
    }

    registrarSolicitudPermiso(solicitudPermiso: RegistroSolicitud){
        return this.httpClient.post(`${ environment.urlApi }registrarSolicitudCuota`,solicitudPermiso).pipe(
            map((result: any) => result),
            catchError(handleError)
        );
    }

    listarIpsPorEntidad(idEntidad :number){
        return this.httpClient.get(`${ environment.urlApi }listarIpsEntidad?idEntidad=${idEntidad}`).pipe(
            map((result: any) => result),
            catchError(handleError)
        );        
    }

    listarEstadosSolicitud(){
        return this.httpClient.get(`${ environment.urlApi }listarEstadosSolicitud`).pipe(
            map((result: any) => result),
            catchError(handleError)
        );        
    }

    listarTiposSolicitud(){
        return this.httpClient.get(`${ environment.urlApi }listarTiposSolicitud`).pipe(
            map((result: any) => result),
            catchError(handleError)
        );        
    }
    
    buscarDetalleSolicitud(idSolicitud :number){
        return this.httpClient.get(`${ environment.urlApi }buscarDetalleSolicitud?idSolicitud=${idSolicitud}`).pipe(
            map((result: any) => result),
            catchError(handleError)
        );        
    }

    verConsumoCuota(idEntidad :number,idOperacion :number,anio :number, mes: number){
        return this.httpClient.get(`${ environment.urlApi }historialCuota?idEntidad=${idEntidad}&idOperacion=${idOperacion}&anio=${anio}&mes=${mes}`).pipe(
            map((result: any) => result),
            catchError(handleError)
        );        
    }    

    listarUsuarios(usuarios: any){
        return this.httpClient.post(`${ environment.urlApi }buscarUsuarios`,usuarios).pipe(
            map((result: any) => result),
            catchError(handleError)
        );
    }
    
    listarPerfilesUsuarios(){
        return this.httpClient.get(`${ environment.urlApi }listarComboPerfil`).pipe(
            map((result: any) => result),
            catchError(handleError)
        );        
    }
    

    reestablecerContr(idUsuario :number){
        return this.httpClient.get(`${ environment.urlApi }restablecerPassword?idUsuario=${idUsuario}`).pipe(
            map((result: any) => result),
            catchError(handleError)
        );        
    }

    saveUsuario(usuarios: any){
        return this.httpClient.post(`${ environment.urlApi }registrarUsuario`,usuarios).pipe(
            map((result: any) => result),
            catchError(handleError)
        );
    }

    editUsuario(usuarios: any){
        return this.httpClient.post(`${ environment.urlApi }modificarUsuario`,usuarios).pipe(
            map((result: any) => result),
            catchError(handleError)
        );
    }

}