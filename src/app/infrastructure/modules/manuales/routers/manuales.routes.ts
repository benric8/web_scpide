import { Routes } from '@angular/router';
import { PageNotFoundComponent } from '../../../shared/pages/page-not-found/page-not-found.component';
import { LayoutComponent } from 'src/app/infrastructure/layouts/layout/layout.component';
import { ManualUsuarioComponent } from '../components/manual-usuario/manual-usuario.component';

export const MANUALES_ROUTES: Routes = [
    {
        path: '',
         component: LayoutComponent, 
        children: [
          { path: '', redirectTo: 'manual-usuario', pathMatch: 'full' },
          { path: 'manual-usuario', component: ManualUsuarioComponent, data: { title: "manual-usuario"}},
          { path: '**', component: PageNotFoundComponent, data: { title: 'Pagina no encontrada' }}  
        ]
    }
]