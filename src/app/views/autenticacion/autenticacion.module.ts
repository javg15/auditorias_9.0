import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SharedModule } from '../_shared/shared.module';

import { AutenticacionRoutingModule } from './autenticacion-routing.module';
import { UsuariosService } from './usuarios/services/usuarios.service';

import { DataTablesModule } from 'angular-datatables';


// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  imports: [
    CommonModule,
    AutenticacionRoutingModule,
    FormsModule,
    DataTablesModule,
    ModalModule.forRoot(),
    SharedModule,
    TabsModule.forRoot(),
    
  ],
  declarations: [
  ],
  providers: [
    UsuariosService,
  ],
  exports:[
  ]
})
export class AutenticacionModule { }
