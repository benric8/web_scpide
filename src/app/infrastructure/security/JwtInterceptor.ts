import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../services/local/local-storage.service'; 
import { AuthService } from '../services/remote/auth.service';
import { RefreshTokenResponse } from '../../domain/dto/RefreshTokenResponse.dto';
import { constantes } from 'src/app/constants';
@Injectable({
    providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {

    private refreshTokenInProgress = false;
    private refreshTokenSubject: Subject<any> = new BehaviorSubject<any>(null);

    constructor(private route: Router, public authService: AuthService, private localStorage: LocalStorageService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = this.localStorage.getToken();
        if (token != undefined && token != null) {//----
            if(req.url != `${ environment.urlApi }api/authenticate` && !req.url.endsWith('.json')){
                //console.log('verificacion de tiempo valido ', req.url);
                /*if(!this.localStorage.isTimetSessionRefreshValid()){
                    this.logOutRefresh();
                    return throwError(() => {
                        return "Tiempo de inactividad excedido";
                    });
                }
                if(!req.url.includes('seguridad/refresh')){
                    if(!this.localStorage.isTimetSessionValid()){
                        return this.handleRefresh(req, next, token)
                    }
                }*/
                req = req.clone({
                    setHeaders: {
                        'Content-Type':  'application/json',
                         Authorization: `Bearer ${ token }`
                    }
                });
            }
        } 
        else {
            console.log("No hay Token");
        }
        return next.handle(req);
    }
    private handleRefresh(request: HttpRequest<any>, next: HttpHandler, token: any){
        if (!this.refreshTokenInProgress) {
            this.refreshTokenInProgress = true;
            this.refreshTokenSubject.next(null);
            let newDAte:Date = new Date();  
            return this.authService.refreshToken(token).pipe(
              switchMap((data: any) => {
                let dataRefresh:RefreshTokenResponse = data;
                if(dataRefresh.codigo===constantes.RES_COD_EXITO){
                    this.localStorage.setToken(dataRefresh.data);
                    this.localStorage.setDatetimeNewToken(newDAte);
                    this.refreshTokenInProgress = false;
                    this.refreshTokenSubject.next(dataRefresh.data);//----------
                    console.log('refresh realizado correctamente, continua el proceso', request);
                    return next.handle(this.injectToken(request));
                }
                else{
                    return throwError(() => {
                      return dataRefresh.descripcion;
                    });
                  }
              }),
              catchError(err => {
                //this.refreshTokenInProgress = false;
                console.log('error refresh jwt interceptor');
                if(err.status === 401 || err.status === 403){
                  this.logOutRefresh();
                  console.log("error refresh",err);
                }
                this.refreshTokenInProgress = false;
                return throwError(()=>err);
              }));
      
          } 
          else {
            return this.refreshTokenSubject.pipe(
              filter(token => token != null),
              take(1),
              switchMap(jwt => {
                return next.handle(this.injectToken(request));
              }));
          }
        }
      
        injectToken(request: HttpRequest<any>) {
          //console.log("inyectamdo");
          const token = this.localStorage.getToken();
          return request.clone({
              setHeaders: {
                  'Content-Type':  'application/json',
                  Authorization: `Bearer ${ token }`
              }
          });
        }

        logOutRefresh():void{
            //Swal.fire('Atención!', 'Error en autenticación, intente ingresar al sistema nuevamente', 'error');
            this.route.navigate(['/autenticacion/login']);
        }
  }
  