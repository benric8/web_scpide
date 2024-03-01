import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { AppCpState } from './infrastructure/global-store/cp.reducers';
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router'
import { Observable } from 'rxjs';
import { LocalStatesService } from './infrastructure/services/local/local-states.service';
import Swal from 'sweetalert2';
import { LocalStorageUsuarioService } from './infrastructure/services/local/local-storage-usuario.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'servicios-comunes-pide-web';
  public showOverlay = true;
  eventStateTokenExpired$:Observable<any> = new Observable();
  constructor(private primengConfig: PrimeNGConfig,
    private translateService: TranslateService, 
    private store: Store<AppCpState>,
    private router: Router,
    private localStateService: LocalStatesService,
    private localStorageUsuarioService: LocalStorageUsuarioService){
      this.eventStateTokenExpired$ = this.localStateService.getStateTokenExpiredMarker();
      router.events.subscribe((event: RouterEvent) => {
        this.navigationInterceptor(event)
      })
  }
  ngOnInit() {
    this.primengConfig.ripple = true;
    //console.log("mostrando mensaje")
    
    this.store.select('mostrarCargando').subscribe(({estado}) => {
      if(estado){
        this.mostrarCargando();
      } 
      else{
        this.ocultarCargando();
      }

    });   

    this.translateService.setDefaultLang('es');
    this.translateService.use("es");
    this.translateService.get('primeng').subscribe(res => this.primengConfig.setTranslation(res));

    this.eventStateTokenExpired$.subscribe((tokenExpired:any) => {
      if(tokenExpired){ 
        setTimeout(() => {
          this.cerrarventana("Autorización Expirado",'El aplicativo se cerrara en este momento');
        }, 1000);
      }
    });

  }
  cerrarventana(mensaje:string, bodyHtml:string){
    Swal.fire({
      title: mensaje,
      html:bodyHtml,
      confirmButtonText: "OK",
      allowOutsideClick:false
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/autenticacion/login']);
      } 
    });
  }
  mostrarCargando() {    
    document.getElementById("cargando")?.classList.add('show-loading');
  }

  ocultarCargando() {
    document.getElementById("cargando")?.classList.remove('show-loading');
  }
  // navigator interceptor
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      //console.log("navigator start",event);
      this.showOverlay = true;
      this.mostrarCargando();
      if(!this.localStorageUsuarioService.verificarPermisos(event.url)){
        this.cerrarventana('Acdeso no permitido','Verifique la URL del sistema  al que esta accediendo')
      }
    }
    if (event instanceof NavigationEnd) {
      this.showOverlay = false;
      this.ocultarCargando();
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.showOverlay = false;
      this.ocultarCargando();
    }
    if (event instanceof NavigationError) {
      this.showOverlay = false;
      this.ocultarCargando();
    }
  }
}
