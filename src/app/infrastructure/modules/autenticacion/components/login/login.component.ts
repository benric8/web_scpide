import { Component, OnInit,ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from 'src/app/infrastructure/services/remote/auth.service'; 
import { LocalStorageService } from 'src/app/infrastructure/services/local/local-storage.service';
import { LoginService } from 'src/app/infrastructure/services/remote/login.service';
import { LocalStorageUsuarioService } from 'src/app/infrastructure/services/local/local-storage-usuario.service';

import { RecaptchaComponent, RecaptchaErrorParameters } from 'ng-recaptcha';
import { tokenResponse } from 'src/app/domain/dto/tokenResponse.dto';
import { LoginRequest } from 'src/app/domain/dto/LoginRequest.dto';
import { LoginResponse } from 'src/app/domain/dto/LoginResponse.dto';
import Swal from 'sweetalert2';

import { Store } from '@ngrx/store';
import * as actions from '../../../../global-store/cp.actions';
import { AppCpState } from '../../../../global-store/cp.reducers';
import { constantes } from 'src/app/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit  {
  colorSVG = constantes.COLOR_PRIMARY;
  versionApp: string = environment.versionApp;
  tokenLoad:boolean = false;
  loginLoad:boolean = false;
  loginBlock:boolean = false;
  user: LoginRequest;
  //------------- captcha config ---
  capchaKey: string = environment.tokenCaptcha;
  recaptcha:any = (window as any).grecaptcha;
  capchaLoad: boolean=false;
  tokenCapcha:string | null=null;
  tokenCapchaLast:string | null=null;
  errorCapcha:boolean=false;
  
  //--
  @ViewChild('captchaElem', { static: false }) captchaElem: RecaptchaComponent | null = null;
  constructor(private primengConfig: PrimeNGConfig,
    private route: Router, 
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private localStorageService:LocalStorageService,
    private localStorageUsuarioService:LocalStorageUsuarioService,
    private loginService: LoginService,
    private store: Store<AppCpState>) {
      this.user = {
        usuario: '',
        contrasenia: '',
        token: '',
        tokenCaptcha: '',
        aplicaCaptcha: 'N'}
      this.localStorageService.logoutSession();
      this.autenticate();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  autenticate():void{
    this.tokenLoad = false;
    this.store.dispatch(actions.mostrarCargando({ estado: true}));
    this.authService.recuperarTokenAutorization().subscribe({
      next:(data:tokenResponse)=>{
        //console.log("data set autorization",data);
        this.localStorageService.setToken(data.token);
        //this.localStorageService.setTimeTokenValido(data.exps);
        //this.localStorageService.setTimeRefreshValido(data.refs);
      },
      complete:()=>{
        this.tokenLoad = true;
        this.store.dispatch(actions.mostrarCargando({ estado: false}));
      },
      error:(err)=>{
        this.tokenLoad = true;
        this.loginBlock = true;
        this.store.dispatch(actions.mostrarCargando({ estado: false}));
        //console.log("error autorization",err);
        Swal.fire('Atención!', "Error en la conexión con el servicio, recargue la página.", 'warning');
      }
    });
  }

  login():void {
    this.loginLoad = true;
    
    if(this.user.usuario){
      this.user.usuario = this.user.usuario.trim();
      //this.user.usuario = this.user.usuario.toUpperCase();
    }

    if(this.user.contrasenia){
      this.user.contrasenia = this.user.contrasenia.trim();
      //this.user.contrasenia = this.user.contrasenia.toUpperCase();
    }

    if(!this.tokenCapcha){
      Swal.fire('Atención!', 'Complete el CAPTCHA para poder ingresar al sistema', 'warning');
      this.loginLoad = false;
      return;
    }

    this.store.dispatch(actions.mostrarCargando({ estado: true}));
    let tokenAut = this.localStorageService.getToken();
    if(tokenAut){
      this.user.token = tokenAut;
      this.user.aplicaCaptcha='S';
      this.user.tokenCaptcha = this.tokenCapcha;
      if(this.user.usuario && this.user.usuario!="" && this.user.contrasenia && this.user.contrasenia!=""){
        this.loginService.login({...this.user}).subscribe({
          next:(data:LoginResponse)=>{
            //console.log("login",data);
            if(data.codigo===constantes.RES_COD_EXITO){
              this.localStorageUsuarioService.setUsuario(data.data);
              this.localStorageService.setToken(data.data.token);
              /*
              if(data.data.perfiles.length == 1){
                //this.loginService.setOpciones(data.data.perfiles[0])
                //this.route.navigate([data.data.perfiles[0].opciones[0].url]);
              }
              else{
                this.route.navigate(['/autenticacion/seleccion-perfil']);
              }*/
              this.captchaElem?.reset();
              this.route.navigate(['/autenticacion/seleccion-perfil']);
            }
            else{
              this.captchaElem?.reset();
              this.loginLoad = false;
              this.store.dispatch(actions.mostrarCargando({ estado: false}));
              Swal.fire('Atención!', data.descripcion+ '\n Código de Operación:'+ data.codigoOperacion, 'info');
            }
          },
          complete:()=>{
            //this.loginLoad = false;
            //this.store.dispatch(actions.mostrarCargando({ estado: false}));
          },
          error:(err)=>{
            console.log("error login", err);
            Swal.fire('Atención!', err, 'warning');
            //---------
            this.captchaElem?.reset();
            this.loginLoad = false;
            this.store.dispatch(actions.mostrarCargando({ estado: false}));
            this.autenticate();
          }
        });
      }
      else{
        Swal.fire('Atención!', 'Complete usuario y contraseña, para ingresar al sistema.', 'warning');
        this.captchaElem?.reset();
        this.loginLoad = false;
        this.store.dispatch(actions.mostrarCargando({ estado: false}));
      }
    }
    else{
      Swal.fire('Atención!', 'Autorización requerida, inténtelo nuevamente.', 'warning');
      this.captchaElem?.reset();
      this.loginLoad = false;
      this.autenticate();
    }
    

    //this.route.navigate(['/consulta'], {relativeTo: this.activatedRoute});
  }
  showResponseCapcha(event:any){
    //console.log(event);
    this.tokenCapcha = event.response;
    this.tokenCapchaLast = event.response;
    this.errorCapcha=false;
  }
  showExpireCapcha(event:any){
    //console.log(event);
    this.capchaLoad=false;
    this.captchaElem?.reset();
  }
  public resolved(captchaResponse: string): void {
    this.tokenCapcha = captchaResponse;
    this.tokenCapchaLast = captchaResponse;
  }
  
  public onError(errorDetails: RecaptchaErrorParameters): void {
    console.log(`reCAPTCHA error encountered; details:`, errorDetails);
    Swal.fire('Problema con Captcha de Google',('reCAPTCHA error encountered; details:' + errorDetails), 'error' );
  }

  reloadLogin(){
    window.location.reload();
  }
}
