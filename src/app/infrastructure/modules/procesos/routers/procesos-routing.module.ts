import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from 'src/app/infrastructure/layouts/layout/layout.component';
import { PageNotFoundComponent } from 'src/app/infrastructure/shared/pages/page-not-found/page-not-found.component';
import { NuevaSolicitudComponent } from '../components/nueva-solicitud/nueva-solicitud.component';
import { SolicitudesComponent } from '../components/solicitudes/solicitudes.component';
import { PermisosComponent } from '../components/permisos/permisos.component';

const routes: Routes = [
  {path: '', component: LayoutComponent,
      children: [
        { path: 'nueva-solicitud', component: NuevaSolicitudComponent, data: { title: "Nueva Solicitud"}},
        { path: 'solicitudes', component: SolicitudesComponent, data: { title: "Solicitudes"}},
        { path: 'permisos', component: PermisosComponent, data: { title: "Permisos"}},
        
        { path: '**', component: PageNotFoundComponent, data: { title: 'Pagina no encontrada' }}  
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcesosRoutingModule { }
