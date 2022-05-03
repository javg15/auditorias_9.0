import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuditoriasAdminComponent } from './admin/auditorias-admin.component';
import { AuditoriasFormComponent } from './form/auditorias-form.component';
import { AuditoriasIniService } from './services/auditorias.ini.service';

import { AuditoriasdetalleFormComponent } from './formsub/auditoriasdetalle-form.component';
import { AuditoriasdetalleIniService } from './services/auditoriasdetalle.ini.service';
import { AuditoriasanexosFormComponent } from './formanexos/auditoriasanexos-form.component';
import { AuditoriasanexosIniService } from './services/auditoriasanexos.ini.service';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Auditorías'
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
          userdataDetalle: AuditoriasdetalleIniService,
          userdataAnexos: AuditoriasanexosIniService
        }
      },
      {
        path: 'form',
        component: AuditoriasFormComponent,
        data: {
          title: 'Auditorías'
        },
      },
      {
        path: 'form',
        component: AuditoriasdetalleFormComponent,
        data: {
          title: 'Auditorías detalle'
        }
      },
      {
        path: 'form',
        component: AuditoriasanexosFormComponent,
        data: {
          title: 'Auditorías anexos'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditoriasRoutingModule {}
