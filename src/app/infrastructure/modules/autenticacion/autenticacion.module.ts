import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AutenticacionRoutingModule } from './routers/autenticacion-routing.module';
import { LoginComponent } from './components/login/login.component';
import { SeleccionPerfilComponent } from './components/seleccion-perfil/seleccion-perfil.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { BlockUIModule } from 'primeng/blockui';
import { PanelModule } from 'primeng/panel';

import { RecaptchaModule } from 'ng-recaptcha';

// shared
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { CambiarContraseniaComponent } from './components/cambiar-contrasenia/cambiar-contrasenia.component';
import { FondoSvgComponent } from './components/login/fondo-svg/fondo-svg.component';

@NgModule({
  declarations: [
    LoginComponent,
    SeleccionPerfilComponent,
    CambiarContraseniaComponent,
    FondoSvgComponent
  ],
  imports: [
    CommonModule,
    AutenticacionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RippleModule,
    ButtonModule,
    PasswordModule,
    InputTextModule,
    TooltipModule,
    RecaptchaModule,
    DividerModule,
    ProgressBarModule,
    BlockUIModule,
    PanelModule,
    NavbarComponent,
    FooterComponent,
    PageHeaderComponent
  ]
})
export class AutenticacionModule { }
