import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutenticacionRoutingModule {}
