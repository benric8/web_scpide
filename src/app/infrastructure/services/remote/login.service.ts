import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from "rxjs";
import { LoginRequest } from 'src/app/domain/dto/LoginRequest.dto';
import { LoginResponse } from 'src/app/domain/dto/LoginResponse.dto';

import { LocalStorageService } from '../local/local-storage.service';
import { OpcionesRequest } from 'src/app/domain/dto/OpcionesRequest.dto';
import { OpcionesResponse } from 'src/app/domain/dto/OpcionesResponse.dto';
import { CambiarClaveRequest } from 'src/app/domain/dto/CambiarClaveRequest.dto';
import { handleError } from './BaseService';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient, private localStorageService:LocalStorageService) { }
  login(user: LoginRequest) {
    let newDAte:Date = new Date();
    return this.httpClient.post(`${ environment.urlApi }login`, user).pipe(
        map((result: any) => {
          let loginResponse:LoginResponse = result;
          if(loginResponse.codigo==='0000'){
            this.localStorageService.setDatetimeNewToken(newDAte);
          }
          return result;
        }),
        catchError(handleError)
    );
  }
  
  opciones(req: OpcionesRequest) {
    let newDAte:Date = new Date();
    this.localStorageService.setDatetimeNewToken(new Date());
    return this.httpClient.post(`${ environment.urlApi }auth/web/opciones`, req).pipe(
        map((result: any) => {
          let opcionesResponse:OpcionesResponse = result;
          if(opcionesResponse.codigo==='0000'){
            this.localStorageService.setDatetimeNewToken(newDAte);
          }
          return result;
        }),
        catchError(handleError)
    );
  }
  postCambiarContraseña(cambiarClave: CambiarClaveRequest) {
    return this.httpClient.post(`${ environment.urlApi }cambiarPassword`, cambiarClave).pipe(
      map((result: any) => result),
      catchError(handleError)
    );
} 



  /*handleError(err: HttpErrorResponse): Observable<never> {
    console.log("Error services ",err);
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = err.error.message;
    } else {
        if(!err.status){
          return throwError(() => {
            return err;
          });
        }
        if(err.status === 401 || err.status === 403){
          errorMessage = 'Error en autenticación, intente ingresar al sistema nuevamente';
        }else{
          errorMessage = `Error: ${err.status}\n Mensaje: ${err.message}`;
        }
    }
    //console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
    //return throwError(() => err);
  }*/
}
