import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuditoriasAdminComponent } from './admin/auditorias-admin.component';
import { AuditoriasFormComponent } from './form/auditorias-form.component';
import { AuditoriasIniService } from './services/auditorias.ini.service';

import { AuditoriasdetalleFormComponent } from './formsub/auditoriasdetalle-form.component';
import { AuditoriasdetalleIniService } from './services/auditoriasdetalle.ini.service';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Horas docentes'
    },
    children: [
      {
        path: '',
        redirectTo: 'admin'
      },
      {
        path: 'admin',
        component: AuditoriasAdminComponent,
        data: {
          title: 'Listado'
        },
        resolve: {
          userdata: AuditoriasIniService,
          userdataDetalle: AuditoriasdetalleIniService
        }
      },
      {
        path: 'form',
        component: AuditoriasFormComponent,
        data: {
          title: 'Horas clase'
        },
      },
      {
        path: 'form',
        component: AuditoriasdetalleFormComponent,
        data: {
          title: 'Auditorias sueldos'
        }
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditoriasRoutingModule {}
