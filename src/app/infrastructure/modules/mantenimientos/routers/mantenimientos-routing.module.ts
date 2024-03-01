import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from 'src/app/infrastructure/layouts/layout/layout.component';

import { UsuariosComponent } from '../components/usuarios/usuarios.component';
import { OperacionesComponent } from '../components/operaciones/operaciones.component';
import { PageNotFoundComponent } from 'src/app/infrastructure/shared/pages/page-not-found/page-not-found.component';

const routes: Routes = [
  {path: '', component: LayoutComponent,
      children: [
        { path: 'usuarios', component: UsuariosComponent, data: { title: "Usuarios"}},
        { path: 'operaciones', component: OperacionesComponent, data: { title: "Operaciones"}},
        
        { path: '**', component: PageNotFoundComponent, data: { title: 'Pagina no encontrada' }}  
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientosRoutingModule { }
