import { Injectable } from '@angular/core';
import { handleError } from './BaseService';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs';
import { OperacionCrearRequest, OperacionModificarRequest } from 'src/app/domain/dto/OperacionRequest.dto';

@Injectable({
  providedIn: 'root'
})
export class MantenimientosService{
  constructor(private httpClient: HttpClient) { }
  getOperaciones(){
    return this.httpClient.get(`${ environment.urlApi }listarOperacion`).pipe(
      map((result: any) => result),
      catchError(handleError)
    );
  }

  postCrearOperacion(operacion:OperacionCrearRequest){
    return this.httpClient.post(`${ environment.urlApi }registrarOperacion`, operacion).pipe(
      map((result: any) => result),
      catchError(handleError)
    );
  }

  postActualizarOperacionb(operacion:OperacionModificarRequest){
    return this.httpClient.post(`${ environment.urlApi }modificarOperacion?idOperacion=${operacion.idOperacion}`, operacion).pipe(
      map((result: any) => result),
      catchError(handleError)
    );
  }
}
