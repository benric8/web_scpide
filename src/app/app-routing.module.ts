import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './infrastructure/shared/pages/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'autenticacion', pathMatch: 'full' },
  { path: 'autenticacion', loadChildren: () => import('./infrastructure/modules/autenticacion/autenticacion.module').then(m => m.AutenticacionModule)},
  { path: 'procesos', loadChildren: () => import('./infrastructure/modules/procesos/procesos.module').then(m => m.ProcesosModule)},
  { path: 'mantenimientos', loadChildren: () => import('./infrastructure/modules/mantenimientos/mantenimientos.module').then(m => m.MantenimientosModule)},
  { path: 'manuales', loadChildren: () => import('./infrastructure/modules/manuales/routers/manuales.routes').then(m => m.MANUALES_ROUTES)},
  //{ path: 'reportes', loadChildren: () => import('./pages/reportes/reportes.module').then(m => m.ReportesModule)},
  { path: '**', component: PageNotFoundComponent, data: { title: 'Pagina no encontrada' }}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
