import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from '../components/login/login.component';
import { SeleccionPerfilComponent } from '../components/seleccion-perfil/seleccion-perfil.component';
import { CambiarContraseniaComponent } from '../components/cambiar-contrasenia/cambiar-contrasenia.component';
import { PageNotFoundComponent } from 'src/app/infrastructure/shared/pages/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, data: { title: 'Login' }},
  { path: 'seleccion-perfil', component: SeleccionPerfilComponent, data: { title: 'Perfil' }},
  { path: 'cambiar-contrasenia', component: CambiarContraseniaComponent, data: { title: 'Perfil' }},
  { path: '**', component: PageNotFoundComponent, data: { title: 'Pagina no encontrada' }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutenticacionRoutingModule { }
