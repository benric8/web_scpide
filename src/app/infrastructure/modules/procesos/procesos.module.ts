import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ProcesosRoutingModule } from './routers/procesos-routing.module';
import { NuevaSolicitudComponent } from './components/nueva-solicitud/nueva-solicitud.component';
import { SolicitudesComponent } from './components/solicitudes/solicitudes.component';
import { PermisosComponent } from './components/permisos/permisos.component';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

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
import {FieldsetModule} from 'primeng/fieldset';

import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToolbarModule } from 'primeng/toolbar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {InputMaskModule} from 'primeng/inputmask';
import {ChartModule} from 'primeng/chart';
import {AutoCompleteModule} from 'primeng/autocomplete';

@NgModule({
  declarations: [
    NuevaSolicitudComponent,
    SolicitudesComponent,
    PermisosComponent
  ],
  imports: [
    CommonModule,
    ProcesosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderComponent,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    RippleModule,
    DialogModule,
    TableModule,
    //ProgressBarModule,
    ToolbarModule,
    OverlayPanelModule,
    CalendarModule,
    FieldsetModule,
    DividerModule,
    PaginatorModule,
    PanelModule,
    CheckboxModule,
    RadioButtonModule,
    InputTextareaModule,
    MultiSelectModule,
    //PasswordModule,
    InputMaskModule,
    ChartModule,
    AutoCompleteModule,
  ]
})
export class ProcesosModule { }
