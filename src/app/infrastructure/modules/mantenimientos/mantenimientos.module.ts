import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MantenimientosRoutingModule } from './routers/mantenimientos-routing.module';

import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

import {SidebarModule} from 'primeng/sidebar';
import {MenuModule} from 'primeng/menu';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import {DropdownModule} from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import {PanelModule} from 'primeng/panel';
import {PaginatorModule} from 'primeng/paginator';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {RadioButtonModule} from 'primeng/radiobutton';
import {RippleModule} from 'primeng/ripple';
import {DividerModule} from 'primeng/divider';
import {DialogModule} from 'primeng/dialog';
import {CalendarModule} from 'primeng/calendar';

import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToolbarModule } from 'primeng/toolbar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {InputMaskModule} from 'primeng/inputmask';

import { StoreModule } from '@ngrx/store';
import { appMantenimientosReducers } from './store/mantenimientos.reducers';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { OperacionesComponent } from './components/operaciones/operaciones.component';

@NgModule({
  declarations: [
    UsuariosComponent,
    OperacionesComponent
  ],
  imports: [
    CommonModule,
    MantenimientosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderComponent,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    RippleModule,
    DialogModule,
    TableModule,
    ProgressBarModule,
    ToolbarModule,
    OverlayPanelModule,
    CalendarModule,
    DividerModule,
    PaginatorModule,
    PanelModule,
    CheckboxModule,
    RadioButtonModule,
    InputTextareaModule,
    MultiSelectModule,
    PasswordModule,
    InputMaskModule,
    StoreModule.forFeature('MantenimientosModule', appMantenimientosReducers)
  ]
})
export class MantenimientosModule { }
