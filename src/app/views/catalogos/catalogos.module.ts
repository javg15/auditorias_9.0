import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../_shared/shared.module';


import { CatalogosRoutingModule } from './catalogos-routing.module'
import { CatejerciciosAdminComponent } from './catejercicios/admin/catejercicios-admin.component';
import { CatejerciciosFormComponent } from './catejercicios/form/catejercicios-form.component';
import { CatejerciciosService } from './catejercicios/services/catejercicios.service';

import { DataTablesModule } from 'angular-datatables';

@NgModule({
  imports: [CommonModule,
    CatalogosRoutingModule,
    DataTablesModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    ModalModule.forRoot(),
  ],
  declarations: [CatejerciciosAdminComponent,
    CatejerciciosFormComponent
  ],
  providers: [
    CatejerciciosService, 
  ]

})
export class CatalogosModule { }
