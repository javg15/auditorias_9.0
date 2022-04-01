/*import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuariosAdminComponent } from './admin/usuarios-admin.component';
import { UsuariosFormComponent } from './form/usuarios-form.component';
import { UsuariosFormdirectComponent } from './formdirect/usuarios-formdirect.component';
import { UsuariosIniService } from './services/usuarios.ini.service';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Usuarios'
    },
    children: [
      {
        path: '',
        redirectTo: 'admin'
      },
      {
        path: 'admin',
        component: UsuariosAdminComponent,
        data: {
          title: 'Usuarios'
        },
        resolve: {
          userdata: UsuariosIniService
        }
      },
      {
        path: 'form',
        component: UsuariosFormComponent,
        data: {
          title: 'Usuarios'
        }
      },
      {
        path: 'formdirect',
        component: UsuariosFormdirectComponent,
        data: {
          title: 'Perfil de usuario'
        }
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule {}
*/