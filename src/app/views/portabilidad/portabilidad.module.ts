import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SharedModule } from '../_shared/shared.module';

import { PortabilidadRoutingModule } from './portabilidad-routing.module';
import { PortabilidadService } from './services/portabilidad.service';
import { PortabilidadFormComponent } from './form/portabilidad-form.component';
import { DataTablesModule } from 'angular-datatables';
import { Select2Module } from 'ng-select2-component';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    PortabilidadRoutingModule,
    FormsModule,
    DataTablesModule,
    ModalModule.forRoot(),
    SharedModule,
    Select2Module,
    NgxPrintModule
  ],
  declarations: [
    PortabilidadFormComponent,
  ],
  providers: [
    PortabilidadService
  ]
})
export class PortabilidadModule { }
