import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuditoriasAdminComponent } from './admin/auditorias-admin.component';
import { AuditoriasFormComponent } from './form/auditorias-form.component';
import { AuditoriasIniService } from './services/auditorias.ini.service';

import { AuditoriasdetalleFormComponent } from './formsub/auditoriasdetalle-form.component';
import { AuditoriasdetalleIniService } from './services/auditoriasdetalle.ini.service';
import { AuditoriasanexosFormComponent } from './formanexos/auditoriasanexos-form.component';
import { AuditoriasanexosIniService } from './services/auditoriasanexos.ini.service';
import { AuditoriasreporteFormComponent } from './formreporte/auditoriasreporte-form.component';
import { AuditoriasbusquedaavanzadaFormComponent } from './formbusquedaavanzada/auditoriasbusquedaavanzada-form.component';



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
        path: 'detalle',
        component: AuditoriasdetalleFormComponent,
        data: {
          title: 'Auditorías detalle'
        }
      },
      {
        path: 'anexos',
        component: AuditoriasanexosFormComponent,
        data: {
          title: 'Auditorías anexos'
        }
      },
      {
        path: 'reporte',
        component: AuditoriasreporteFormComponent,
        data: {
          title: 'Auditorías reportes'
        }
      },
      {
        path: 'busquedaavanzada',
        component: AuditoriasbusquedaavanzadaFormComponent,
        data: {
          title: 'busqueda avanzada'
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
