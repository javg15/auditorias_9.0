import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
// Collapse Component
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { SearchAdminComponent } from './search/search-admin.component';
import { HeaderAdminComponent } from './header/header-admin.component';
import { ValidationSummaryComponent } from './validation/validation-summary.component';
import { DetailsUploadComponent } from './upload/details-upload.component';
import { FormUploadComponent } from './upload/form-upload.component';
import { ListUploadComponent } from './upload/list-upload.component';
import { DetailsUploadFisicoComponent } from './upload_fisico/list/details-uploadFisico.component';
import { FormUploadFisicoComponent } from './upload_fisico/list/form-uploadFisico.component';
import { ListUploadFisicoComponent } from './upload_fisico/list/list-uploadFisico.component';
import { ModaluploadFormComponent } from './upload_fisico/table/modalupload-form.component';
import { TablaUploadFisicoComponent } from './upload_fisico/table/table-uploadFisico.component';

import { Select2Module } from 'ng-select2-component';

@NgModule({
  imports: [
    CommonModule,
    CollapseModule,
    FormsModule,
    ModalModule,
    Select2Module
  ],
  declarations: [
    SearchAdminComponent,
    HeaderAdminComponent,

    ValidationSummaryComponent,
    FormUploadComponent,
    ListUploadComponent,
    DetailsUploadComponent,
    FormUploadFisicoComponent,
    ListUploadFisicoComponent,
    TablaUploadFisicoComponent,
    ModaluploadFormComponent,
    DetailsUploadFisicoComponent,
  ],
  providers: [

  ],
  exports: [
    SearchAdminComponent,
    HeaderAdminComponent,
    ValidationSummaryComponent,
    FormUploadComponent,
    ListUploadComponent,
    DetailsUploadComponent,
    FormUploadFisicoComponent,
    ListUploadFisicoComponent,
    DetailsUploadFisicoComponent,
    TablaUploadFisicoComponent,
    ModaluploadFormComponent,
    CommonModule
  ]
})
export class SharedModule { }
