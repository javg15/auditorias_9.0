import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CatejerciciosAdminComponent } from './catejercicios/admin/catejercicios-admin.component';
import { CatejerciciosIniService } from './catejercicios/services/catejercicios.ini.service';
import { CatentidadesAdminComponent } from './catentidades/admin/catentidades-admin.component';
import { CatentidadesIniService } from './catentidades/services/catentidades.ini.service';
import { CatresponsablesAdminComponent } from './catresponsables/admin/catresponsables-admin.component';
import { CatresponsablesIniService } from './catresponsables/services/catresponsables.ini.service';
import { CatservidoresAdminComponent } from './catservidores/admin/catservidores-admin.component';
import { CatservidoresIniService } from './catservidores/services/catservidores.ini.service';
import { CattiposauditoriaAdminComponent } from './cattiposauditoria/admin/cattiposauditoria-admin.component';
import { CattiposauditoriaIniService } from './cattiposauditoria/services/cattiposauditoria.ini.service';

const routes: Routes = [
  {
    path: 'ejercicios',
    component: CatejerciciosAdminComponent,
    resolve: {
      userdata: CatejerciciosIniService
    },
    data: {
      title: 'Ejercicios'
    },
  },
  {
    path: 'entidades',
    component: CatentidadesAdminComponent,
    resolve: {
      userdata: CatentidadesIniService
    },
    data: {
      title: 'Entidades'
    },
  },
  {
    path: 'responsables',
    component: CatresponsablesAdminComponent,
    resolve: {
      userdata: CatresponsablesIniService
    },
    data: {
      title: 'Responsables'
    },
  },
  {
    path: 'servidores',
    component: CatservidoresAdminComponent,
    resolve: {
      userdata: CatservidoresIniService
    },
    data: {
      title: 'Servidores'
    },
  },
  {
    path: 'tiposauditoria',
    component: CattiposauditoriaAdminComponent,
    resolve: {
      userdata: CattiposauditoriaIniService
    },
    data: {
      title: 'Tipos de auditoría'
    },
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogosRoutingModule { }
