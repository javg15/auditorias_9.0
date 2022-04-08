import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../_shared/shared.module';


import { CatalogosRoutingModule } from './catalogos-routing.module'
import { CatejerciciosAdminComponent } from './catejercicios/admin/catejercicios-admin.component';
import { CatejerciciosFormComponent } from './catejercicios/form/catejercicios-form.component';
import { CatejerciciosService } from './catejercicios/services/catejercicios.service';

import { CatentidadesAdminComponent } from './catentidades/admin/catentidades-admin.component';
import { CatentidadesFormComponent } from './catentidades/form/catentidades-form.component';
import { CatentidadesService } from './catentidades/services/catentidades.service';

import { CatresponsablesAdminComponent } from './catresponsables/admin/catresponsables-admin.component';
import { CatresponsablesFormComponent } from './catresponsables/form/catresponsables-form.component';
import { CatresponsablesService } from './catresponsables/services/catresponsables.service';

import { CatservidoresAdminComponent } from './catservidores/admin/catservidores-admin.component';
import { CatservidoresFormComponent } from './catservidores/form/catservidores-form.component';
import { CatservidoresService } from './catservidores/services/catservidores.service';

import { CattiposauditoriaAdminComponent } from './cattiposauditoria/admin/cattiposauditoria-admin.component';
import { CattiposauditoriaFormComponent } from './cattiposauditoria/form/cattiposauditoria-form.component';
import { CattiposauditoriaService } from './cattiposauditoria/services/cattiposauditoria.service';

import { DataTablesModule } from 'angular-datatables';
import { Select2Module } from 'ng-select2-component';

@NgModule({
  imports: [CommonModule,
    CatalogosRoutingModule,
    DataTablesModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    ModalModule.forRoot(),
    Select2Module
  ],
  declarations: [CatejerciciosAdminComponent,
    CatejerciciosFormComponent,
    CatentidadesAdminComponent,
    CatentidadesFormComponent,
    CatresponsablesAdminComponent,
    CatresponsablesFormComponent,
    CatservidoresAdminComponent,
    CatservidoresFormComponent,
    CattiposauditoriaAdminComponent,
    CattiposauditoriaFormComponent
  ],
  providers: [
    CatejerciciosService, 
    CatentidadesService,
    CatresponsablesService,
    CatservidoresService,
    CattiposauditoriaService
  ]

})
export class CatalogosModule { }
