import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from "rxjs";
 import { LocalStorageService } from '../local/local-storage.service';
import { handleError } from './BaseService';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient, private localStorageService:LocalStorageService) { }
  recuperarTokenAutorization () {
    let newDAte:Date = new Date();
    return  this.httpClient.post(`${ environment.urlApi }api/authenticate`,  null, {
      headers: new HttpHeaders({'username': environment.usuarioConsumo , 'password': environment.claveUsuarioConsumo, 'codigoCliente':  environment.codigoCliente, 'codigoRol': environment.codigoRol}),
      responseType: "json"
      }).pipe(
      map((result:any) => {
        this.localStorageService.setDatetimeNewToken(newDAte);
        return result;
      }),
      catchError(handleError)
    );
  }

  refreshToken (token: any) {
    return this.httpClient.get(`${ environment.urlApi }seguridad/refresh?token=${token}`).pipe(
        map((result:any) =>result),
        catchError(err => {
            //Swal.fire('Atención!', 'Sesión finalizada, ingrese nuevamente.', 'info');
            return throwError(() => err);
          })
    );
  }

}
