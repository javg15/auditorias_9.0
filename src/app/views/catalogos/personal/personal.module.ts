import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SharedModule } from '../../_shared/shared.module';

import { PersonalService } from './services/personal.service';
import { PersonalRoutingModule } from './personal-routing.module';


import { DataTablesModule } from 'angular-datatables';

// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';



@NgModule({
  imports: [
    CommonModule,
    PersonalRoutingModule,
    FormsModule,
    DataTablesModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    
    BsDropdownModule.forRoot(),
    SharedModule
  ],
  declarations: [
  ],
  providers: [
    PersonalService
  ],
  exports: [
  ]
})
export class PersonalModule { }

