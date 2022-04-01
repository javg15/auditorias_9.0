import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuariosAdminComponent } from './usuarios/admin/usuarios-admin.component';
import { UsuariosFormComponent } from './usuarios/form/usuarios-form.component';
import { UsuariosFormdirectComponent } from './usuarios/formdirect/usuarios-formdirect.component';
import { UsuariosIniService } from './usuarios/services/usuarios.ini.service';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Usuarios'
    },
    children: [
      {
        path: 'usuarios',
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
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutenticacionRoutingModule {}
