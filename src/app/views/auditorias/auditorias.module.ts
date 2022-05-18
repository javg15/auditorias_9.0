import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SharedModule } from '../_shared/shared.module';

import { AuditoriasRoutingModule } from './auditorias-routing.module';
import { AuditoriasService } from './services/auditorias.service';
import { AuditoriasAdminComponent } from './admin/auditorias-admin.component';
import { AuditoriasFormComponent } from './form/auditorias-form.component';
import { AuditoriasdetalleFormComponent } from './formsub/auditoriasdetalle-form.component';
import { AuditoriasanexosFormComponent } from './formanexos/auditoriasanexos-form.component';
import { AuditoriasreporteFormComponent } from './formreporte/auditoriasreporte-form.component';
import { DataTablesModule } from 'angular-datatables';
import { Select2Module } from 'ng-select2-component';

@NgModule({
  imports: [
    CommonModule,
    AuditoriasRoutingModule,
    FormsModule,
    DataTablesModule,
    ModalModule.forRoot(),
    SharedModule,
    Select2Module
  ],
  declarations: [
    AuditoriasAdminComponent,
    AuditoriasFormComponent,
    AuditoriasdetalleFormComponent,
    AuditoriasanexosFormComponent,
    AuditoriasreporteFormComponent
  ],
  providers: [
    AuditoriasService
  ]
})
export class AuditoriasModule { }
