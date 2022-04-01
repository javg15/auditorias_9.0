import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { CatalogosRoutingModule } from './catalogos-routing.module'
import { CatejerciciosAdminComponent } from './catejercicios/admin/catejercicios-admin.component';
import { CatejerciciosService } from './catejercicios/services/catejercicios.service';

import { SharedModule } from '../_shared/shared.module';

@NgModule({
  imports: [CommonModule,
    CatalogosRoutingModule,
    DataTablesModule,
    SharedModule,
  ],
  declarations: [CatejerciciosAdminComponent],
  providers: [
    CatejerciciosService, 
  ]

})
export class CatalogosModule { }
