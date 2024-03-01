import { Component } from '@angular/core';
import { Usuario } from 'src/app/domain/dto/LoginResponse.dto'; 
import { PrimeNGConfig } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { Store } from '@ngrx/store';
import * as actions from '../../../../global-store/cp.actions';
import { AppCpState } from '../../../../global-store/cp.reducers';
import { constantes } from 'src/app/constants';
import { LocalStorageUsuarioService } from 'src/app/infrastructure/services/local/local-storage-usuario.service';
import { CambiarClaveRequest } from 'src/app/domain/dto/CambiarClaveRequest.dto';
import { LoginService } from 'src/app/infrastructure/services/remote/login.service';

@Component({
  selector: 'app-cambiar-contrasenia',
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrls: ['./cambiar-contrasenia.component.scss']
})
export class CambiarContraseniaComponent {
  cambiarClave: CambiarClaveRequest = {
    usuario:"",
    claveActual:"",
    claveNueva:"",
    claveNuevaConfi:""
  }

  dataUsuario:Usuario;
  constructor(private route: Router, 
    private activatedRoute: ActivatedRoute,
    private primengConfig: PrimeNGConfig,
    private localStorageUsuarioService: LocalStorageUsuarioService,
    private loginService: LoginService,
    private store: Store<AppCpState>) { 
      this.dataUsuario = this.localStorageUsuarioService.getUsuario();
      this.cambiarClave.usuario = this.dataUsuario.usuario
      this.primengConfig.ripple = true;
  }

  cambiarContrasenia(){
    this.cambiarClave.claveActual = this.cambiarClave.claveActual.trim();
    this.cambiarClave.claveNueva = this.cambiarClave.claveNueva.trim();
    this.cambiarClave.claveNuevaConfi = this.cambiarClave.claveNuevaConfi.trim();

    
    if(this.cambiarClave.claveActual == "") {
        Swal.fire('Atención!', 'Clave actual requerido', 'warning');
        return;
    }
    if(this.cambiarClave.claveNueva == "" || this.cambiarClave.claveNueva.length < 6) {
      Swal.fire('Atención!', 'Clave nueva requerido y debe tener 6 caratéres como minimo', 'warning');
      return;
    }

    if(this.cambiarClave.claveActual == this.cambiarClave.claveNueva) {
      Swal.fire('Atención!', 'La clave nueva no puede ser igual que la clave anterior.', 'warning');
      return;
    }

    if(this.cambiarClave.claveNueva != this.cambiarClave.claveNuevaConfi) {
      Swal.fire('Atención!', 'Confirme la clave nueva', 'warning');
      return;
    }
    this.store.dispatch(actions.mostrarCargando({ estado: true}));

    this.loginService.postCambiarContraseña({...this.cambiarClave}).subscribe({
      next:(data: any)=>{
        if(data.codigo===constantes.RES_COD_EXITO){
          //Swal.fire('Éxito', data.descripcion, 'success');
          this.store.dispatch(actions.mostrarCargando({ estado: false}));
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            html: data.descripcion
          });
          this.route.navigate(['/autenticacion/login'], {relativeTo: this.activatedRoute});
        }
        else{
          
          this.store.dispatch(actions.mostrarCargando({ estado: false}));
          Swal.fire('Atención!', data.descripcion+ '\n Código de Operación:'+ data.codigoOperacion, 'info');
        }
      },
      complete:()=>{
        console.log('request complete');
      },
      error:(err)=>{
        this.store.dispatch(actions.mostrarCargando({ estado: false}));
        Swal.fire('Atención!', err, 'warning');
      }
    });
  }
}
