import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PageHeaderComponent } from 'src/app/infrastructure/shared/components/page-header/page-header.component';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import * as actions from '../../../../global-store/cp.actions';
import { AppCpState } from '../../../../global-store/cp.reducers';
import { LocalStorageUsuarioService } from 'src/app/infrastructure/services/local/local-storage-usuario.service';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-manual-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderComponent
  ],
  templateUrl: './manual-usuario.component.html',
  styleUrls: ['./manual-usuario.component.scss']
})
export class ManualUsuarioComponent {
  urlManual = '';
  perfilManual = '';

  constructor(private store: Store<AppCpState>,
    private localStorageUsuarioService: LocalStorageUsuarioService,
    private sanitizer: DomSanitizer){
      this.store.dispatch(actions.seleccionarOpcionMenu({url:"/manuales/manual-usuario"}));
      this.asignarUrlManual();
  }

  asignarUrlManual():void{
    if(this.localStorageUsuarioService.esServiceDesk()){
      this.urlManual = this.getUrlSanitizer(environment.urlmanualServiceDesk);
      this.perfilManual = 'Perfil ServiceDesk';
    }
    else{
      this.urlManual = this.getUrlSanitizer(environment.urlmanualRenaju);
      this.perfilManual = 'Perfil Renaju';
    }
  }
  getUrlSanitizer(url:string): any  {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
